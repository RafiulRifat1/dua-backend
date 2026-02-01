import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const db = new Database(path.resolve(__dirname, "database.sqlite3"));


const schemaPath = path.resolve(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

db.exec(`
  PRAGMA foreign_keys = OFF;
  DELETE FROM duas;
  DELETE FROM subcategories;
  DELETE FROM categories;
  PRAGMA foreign_keys = ON;
`);

const insertCategory = db.prepare(
  "INSERT INTO categories (name, slug) VALUES (?, ?)"
);

const insertSubcategory = db.prepare(
  "INSERT INTO subcategories (category_id, name, slug) VALUES (?, ?, ?)"
);

const insertDua = db.prepare(
  `INSERT INTO duas 
   (category_id, subcategory_id, title, arabic, reference, transliteration, translation, slug)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const jsonPath = path.resolve(__dirname, "data.json");
const jsonData = fs.readFileSync(jsonPath, "utf8");
const data = JSON.parse(jsonData);

db.transaction(() => {
  for (const category of data.categories) {
    const catInfo = insertCategory.run(
      category.name,
      category.slug ||
        category.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")
    );
    const categoryID = Number(catInfo.lastInsertRowid);

    for (const sub of category.subcategories) {
      const subInfo = insertSubcategory.run(
        categoryID,
        sub.name,
        sub.slug ||
          sub.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")
      );
      const subID = Number(subInfo.lastInsertRowid);

      for (const dua of sub.duas) {
        const title = dua.title || dua.name;
        const slug =
          dua.slug ||
          title.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");

        insertDua.run(
          categoryID,
          subID,
          title,
          dua.arabic || "",
          dua.reference || "",
          dua.transliteration || "",
          dua.translation || "",
          slug
        );
      }
    }
  }
})();

console.log("Seed completed!");
db.close();
