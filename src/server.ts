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



server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})