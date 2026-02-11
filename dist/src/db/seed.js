"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const db = new better_sqlite3_1.default('src/db/database.sqlite3');
const schema = fs_1.default.readFileSync('src/db/schema.sql', 'utf8');
db.exec(schema);
console.log('Database seeded successfully.');
db.close();
