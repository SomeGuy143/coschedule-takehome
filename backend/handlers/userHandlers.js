import inMemoryDB from "./../db.js";

export default class UserHandlers {

    static getUserById(req, res) {
        inMemoryDB.db.get(`SELECT id FROM User WHERE id = ? AND deleted = 0`, [req.params.id], (error, row) => {
            if (error === null) {
              res.send(row);
            } else {
              res.status(500).send(error);
            }
        });
    }

    static getUser(req, res) {
        const auth = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];

        inMemoryDB.db.all(`SELECT id FROM User WHERE deleted = 0 AND username = ? AND password = ?`, [username, password], (error, rows) => {
            if (error === null) {
              res.send(rows);
            } else {
              res.status(500).send(error);
            }
        });
    }

    static createUser(req, res) {
        const auth = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];

        inMemoryDB.db.run(`INSERT INTO User(username, password, deleted) VALUES(?, ?, 0)`, [username, password], function(error) {
            if (error === null) {
              res.send({id: this.lastID});  // id of inserted row
            } else {
              res.status(500).send(error);
            }
        });
    }
}