import sqlite3 from "sqlite3";

export default class InMemoryDB {
    
    static async init() {
        const db = new sqlite3.Database(":memory:");

        db.serialize(() => {
            db.exec(`CREATE TABLE Comment (
                id INTEGER PRIMARY KEY,
                isbn13 TEXT NOT NULL,
                userid INT NOT NULL,
                text TEXT,
                deleted INT NOT NULL)`);

            db.exec(`CREATE TABLE Rating (
                id INTEGER PRIMARY KEY,
                isbn13 TEXT NOT NULL,
                userid INT NOT NULL,
                score INT NOT NULL,
                deleted INT NOT NULL)`);

            db.exec(`CREATE TABLE User (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                deleted INT NOT NULL)`);
        });

        return db;
    }
}