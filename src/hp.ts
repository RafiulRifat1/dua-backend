// src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
const db = new Database("src/db/database.sqlite3");

// ✅ Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Dua Backend API is running 🚀");
});

// ✅ 1. Get all categories
app.get("/api/categories", (req: Request, res: Response) => {
  const rows = db.prepare("SELECT * FROM categories").all();
  res.json(rows);
});

// ✅ 2. Get subcategories by category_id
app.get("/api/subcategories/:category_id", (req: Request, res: Response) => {
  const id = parseInt(req.params.category_id);
  const rows = db.prepare("SELECT * FROM subcategories WHERE category_id = ?").all(id);
  res.json(rows);
});

// ✅ 3. Get all duas (with optional category filter)
app.get("/api/duas", (req: Request, res: Response) => {
  const { category_id } = req.query;
  if (category_id) {
    const rows = db.prepare("SELECT * FROM duas WHERE category_id = ?").all(category_id);
    res.json(rows);
  } else {
    const rows = db.prepare("SELECT * FROM duas").all();
    res.json(rows);
  }
});

// ✅ 4. Get single dua by id
app.get("/api/duas/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const dua = db.prepare("SELECT * FROM duas WHERE id = ?").get(id);
  if (!dua) return res.status(404).json({ error: "Dua not found" });
  res.json(dua);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
