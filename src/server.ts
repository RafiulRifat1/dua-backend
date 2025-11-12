import express , {Request, Response} from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const server = express();
const port = 4000;
server.use(cors());
server.use(express.json());
const db = new Database('src/db/database.sqlite3');

server.get('/', (req: Request, res: Response) => {
    res.send("Server Running");
});

server.get('/categories', (req: Request, res: Response) => {
    res.json(db.prepare( "SELECT * FROM categories" ).all() )
});

server.get('/categories/subcategories' , (req: Request, res: Response) => {
    res.json(db.prepare('SELECT * FROM subcategories').all())
});

server.get('/categories/subcategories/duas', (req: Request, res: Response) => {
    res.json(db.prepare('SELECT * FROM duas').all());
});

server.get('/categories/:categoryID/subcategories', (req: Request, res: Response) => {
    const categoryID = req.params.categoryID;
    res.json(db.prepare('SELECT * FROM subcategories WHERE category_id = ?').all(categoryID));
});

server.get('/duas/:subcategoryID', (req: Request, res: Response) => {
    const subcategoryID = req.params.subcategoryID;
    res.json(db.prepare('SELECT * FROM duas WHERE subcategory_id = ?').all(subcategoryID));
});

server.get('/dua/id/:duaID', (req: Request, res: Response) => {
    const duaID = req.params.duaID;
    res.json(db.prepare('SELECT * FROM duas WHERE id = ?').get(duaID));
});



server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})