
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';


const db = new Database('src/db/database.sqlite3');
const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

db.exec(
    `
    DELETE FROM duas;
    DELETE FROM subcategories;
    DELETE FROM categories;
    `
);


const insertCategory = db.prepare('INSERT INTO categories ( name, slug) values (? , ? )');
const insertSubcategory = db.prepare('INSERT INTO subcategories ( category_id,name, slug) values (?, ? , ? )');
const insertDuas = db.prepare('INSERT INTO duas (category_id, subcategory_id, title, arabic, transliteration, translation, reference, slug) values (?,?,?,? , ?,?,?,? )');

const jsonData = fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf8');
const data = JSON.parse(jsonData);

db.transaction(() => {
    for (const category of data.categories) {
        insertCategory.run(category.name, category.slug || category.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));
        const categoryID = db.prepare('SELECT id FROM categories WHERE name = ? ').get(category.name);

        for (const subCategory of category.subcategories) {
            insertSubcategory.run(categoryID, subCategory.name, subCategory.slug || subCategory.name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));
            const subcategoryID = db.prepare('SELECT id FROM subcategories WHERE name = ? AND category_id = ?').get(subCategory.name, categoryID);
            
            for (const dua of subCategory.duas) {
                insertDuas.run(categoryID, subcategoryID, dua.name, dua.title, dua.arabic, dua.transliteration, dua.translation, dua.reference, dua.slug || dua.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));         
            }
        }
    }
})();


// const categories = [
//     {name: "Dua's important", slug: 'duas-important'},
//   { name: "Time of Dua", slug: "time-of-dua" },
//   { name: "Dua Acceptance", slug: "dua-acceptance" },


// ]
// for (const cat of categories) {
//  insertCategory.run(cat.name, cat.slug);
// }
// const catRows = db.prepare('SELECT * FROM categories').all() as any[];

// for (const cat of catRows) {
//     insertSubcategory.run(cat.id, "General", `${cat.slug}-general`);
//     insertSubcategory.run(cat.id, "Special", `${cat.slug}-special`);
// }

// const subCatRows = db.prepare('SELECT * FROM subcategories').all() as any[];

// for (const dua of subCatRows) {
//     insertDuas.run(
//         dua.category_id,
//         dua.id,
//         "Dua Example",
//         "We Are in Need of Allah’s Help",
//         "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ",
//         "Allahumma a’inni ‘ala dhikrika",
//         "Surah Al-Fatir 35:15",
//         `${dua.slug}-dua-example`
//     );
// }

console.log('Seed data inserted successfully.');
db.close();