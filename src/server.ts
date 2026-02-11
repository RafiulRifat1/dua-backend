import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import Database from "better-sqlite3";

const server = express();
const PORT = process.env.PORT || 4000;

server.use(cors());
server.use(express.json());

const dbPath = path.join(process.cwd(), "database.sqlite3");
const db = new Database(dbPath, { verbose: console.log });

server.get("/", (_req: Request, res: Response) => {
  res.send("Server Running 🚀");
});


server.get("/categories", (_req: Request, res: Response) => {
  const data = db.prepare("SELECT * FROM categories").all();
  res.json(data);
});


server.get("/subcategories", (_req: Request, res: Response) => {
  const data = db.prepare("SELECT * FROM subcategories").all();
  res.json(data);
});

server.get(
  "/categories/:categoryID/subcategories",
  (req: Request, res: Response) => {
    const categoryID = req.params.categoryID;
    const data = db
      .prepare("SELECT * FROM subcategories WHERE category_id = ?")
      .all(categoryID);

    res.json(data);
  }
);


server.get("/duas/:subcategoryID", (req: Request, res: Response) => {
  const subcategoryID = req.params.subcategoryID;
  const data = db
    .prepare("SELECT * FROM duas WHERE subcategory_id = ?")
    .all(subcategoryID);

  res.json(data);
});

server.get("/dua/id/:duaID", (req: Request, res: Response) => {
  const duaID = req.params.duaID;
  const data = db
    .prepare("SELECT * FROM duas WHERE id = ?")
    .get(duaID);

  res.json(data);
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🔥`);
});
