"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const server = (0, express_1.default)();
const port = 4000;
server.use((0, cors_1.default)());
server.use(express_1.default.json());
const db = new better_sqlite3_1.default('src/db/database.sqlite3');
server.get('/', (req, res) => {
    res.send("Server Running");
});
server.get('/categories', (req, res) => {
    res.json(db.prepare("SELECT * FROM categories").all());
});
server.get('/subcategories', (req, res) => {
    res.json(db.prepare('SELECT * FROM subcategories').all());
});
server.get('/categories/subcategories/duas', (req, res) => {
    res.json(db.prepare('SELECT * FROM duas').all());
});
server.get('/categories/:categoryID/subcategories', (req, res) => {
    const categoryID = req.params.categoryID;
    res.json(db.prepare('SELECT * FROM subcategories WHERE category_id = ?').all(categoryID));
});
server.get('/duas/:subcategoryID', (req, res) => {
    const subcategoryID = req.params.subcategoryID;
    res.json(db.prepare('SELECT * FROM duas WHERE subcategory_id = ?').all(subcategoryID));
});
server.get('/dua/id/:duaID', (req, res) => {
    const duaID = req.params.duaID;
    res.json(db.prepare('SELECT * FROM duas WHERE id = ?').get(duaID));
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
