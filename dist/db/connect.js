"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbConnection = getDbConnection;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
let db = null;
function getDbConnection() {
    if (db) {
        return db;
    }
    try {
        const dbPath = path_1.default.resolve(__dirname, 'database.sqlite3');
        db = new better_sqlite3_1.default(dbPath);
        console.log('Connected to database');
        return db;
    }
    catch (error) {
        console.log('Error connecting to database:', error);
        process.exit(1);
    }
}
