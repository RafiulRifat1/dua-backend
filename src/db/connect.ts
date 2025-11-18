import Database , {Database as DBD } from 'better-sqlite3';
import path from 'path';


let db: DBD | null = null;

export function getDbConnection(): DBD {
    if (db) {
        return db;
    } 
    try {
        const dbPath = path.resolve(__dirname, 'database.sqlite3');
        db = new Database(dbPath);
        console.log('Connected to database');
        return db;
    } catch (error) {
        console.log('Error connecting to database:', error);
        process.exit(1);
    }

}
