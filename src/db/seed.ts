import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('src/db/database.sqlite3');
const schema = fs.readFileSync('src/db/schema.sql', 'utf8');

db.exec(schema);

console.log('Database seeded successfully.');

db.close();