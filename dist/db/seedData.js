"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db = new better_sqlite3_1.default(path_1.default.resolve(__dirname, "database.sqlite3"));
// ----- 2. Load schema.sql -----
const schemaPath = path_1.default.resolve(__dirname, "schema.sql");
const schema = fs_1.default.readFileSync(schemaPath, "utf8");
db.exec(schema);
db.exec(`
  PRAGMA foreign_keys = OFF;
  DELETE FROM duas;
  DELETE FROM subcategories;
  DELETE FROM categories;
  PRAGMA foreign_keys = ON;
`);
const insertCategory = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
const insertSubcategory = db.prepare("INSERT INTO subcategories (category_id, name, slug) VALUES (?, ?, ?)");
const insertDua = db.prepare(`INSERT INTO duas 
   (category_id, subcategory_id, title, arabic, reference, transliteration, translation, slug)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
const jsonPath = path_1.default.resolve(__dirname, "data.json");
const jsonData = fs_1.default.readFileSync(jsonPath, "utf8");
const data = JSON.parse(jsonData);
db.transaction(() => {
    for (const category of data.categories) {
        const catInfo = insertCategory.run(category.name, category.slug ||
            category.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"));
        const categoryID = Number(catInfo.lastInsertRowid);
        for (const sub of category.subcategories) {
            const subInfo = insertSubcategory.run(categoryID, sub.name, sub.slug ||
                sub.name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"));
            const subID = Number(subInfo.lastInsertRowid);
            for (const dua of sub.duas) {
                const title = dua.title || dua.name;
                const slug = dua.slug ||
                    title.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
                insertDua.run(categoryID, subID, title, dua.arabic || "", dua.reference || "", dua.transliteration || "", dua.translation || "", slug);
            }
        }
    }
})();
console.log("Seed completed!");
db.close();
