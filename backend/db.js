import sqlite3 from "sqlite3";

export default class InMemoryDB {
    static db = new sqlite3.Database(":memory:");

    static async init() {
        this.db.serialize(() => {
            this.db.exec(`CREATE TABLE Comment (
                id INTEGER PRIMARY KEY,
                isbn13 TEXT NOT NULL,
                userid INT NOT NULL,
                text TEXT,
                deleted INT NOT NULL)`);

            this.db.exec(`CREATE TABLE Rating (
                id INTEGER PRIMARY KEY,
                isbn13 TEXT NOT NULL,
                userid INT NOT NULL,
                score INT NOT NULL,
                deleted INT NOT NULL,
                UNIQUE(isbn13, userid) ON CONFLICT ABORT)`);

            this.db.exec(`CREATE TABLE User (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                deleted INT NOT NULL,
                UNIQUE(username, password) ON CONFLICT ABORT)`);
        });
    }
}