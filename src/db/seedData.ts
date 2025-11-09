
import Database from 'better-sqlite3';

const db = new Database('src/db/database.sqlite3');

db.exec(
    `
    DELETE FROM duas;
    DELETE FROM subcategories;
    DELETE FROM categories;
    `
);

const insertCategory = db.prepare('INSERT INTO categories ( name, slug) values (? , ? )');
const insertSubcategory = db.prepare('INSERT INTO subcategories ( category_id,name, slug) values (?, ? , ? )');
const insertDuas = db.prepare('INSERT INTO duas (category_id, subcategory_id, name, title, arabic, transliteration, reference, slug) values (?,?,?,? , ?,?,?,? )');


const categories = [
    {name: "Dua's important", slug: 'duas-important'},
  { name: "Time of Dua", slug: "time-of-dua" },
  { name: "Dua Acceptance", slug: "dua-acceptance" },


]
for (const cat of categories) {
 insertCategory.run(cat.name, cat.slug);
}
const catRows = db.prepare('SELECT * FROM categories').all() as any[];

for (const cat of catRows) {
    insertSubcategory.run(cat.id, "General", `${cat.slug}-general`);
    insertSubcategory.run(cat.id, "Special", `${cat.slug}-special`);
}

const subCatRows = db.prepare('SELECT * FROM subcategories').all() as any[];

for (const dua of subCatRows) {
    insertDuas.run(
        dua.category_id,
        dua.id,
        "Dua Example",
        "We Are in Need of Allah’s Help",
        "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ",
        "Allahumma a’inni ‘ala dhikrika",
        "Surah Al-Fatir 35:15",
        `${dua.slug}-dua-example`
    );
}

console.log('Seed data inserted successfully.');
db.close();