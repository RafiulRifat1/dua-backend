"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const server = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
server.use((0, cors_1.default)());
server.use(express_1.default.json());
const dbPath = path_1.default.join(process.cwd(), "database.sqlite3");
const db = new better_sqlite3_1.default(dbPath, { verbose: console.log });
server.get("/", (_req, res) => {
    res.send("Server Running 🚀");
});
server.get("/categories", (_req, res) => {
    const data = db.prepare("SELECT * FROM categories").all();
    res.json(data);
});
server.get("/subcategories", (_req, res) => {
    const data = db.prepare("SELECT * FROM subcategories").all();
    res.json(data);
});
server.get("/categories/:categoryID/subcategories", (req, res) => {
    const categoryID = req.params.categoryID;
    const data = db
        .prepare("SELECT * FROM subcategories WHERE category_id = ?")
        .all(categoryID);
    res.json(data);
});
server.get("/duas/:subcategoryID", (req, res) => {
    const subcategoryID = req.params.subcategoryID;
    const data = db
        .prepare("SELECT * FROM duas WHERE subcategory_id = ?")
        .all(subcategoryID);
    res.json(data);
});
server.get("/dua/id/:duaID", (req, res) => {
    const duaID = req.params.duaID;
    const data = db
        .prepare("SELECT * FROM duas WHERE id = ?")
        .get(duaID);
    res.json(data);
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🔥`);
});
