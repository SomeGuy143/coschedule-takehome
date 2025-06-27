import inMemoryDB from "./../db.js";

export default class UserHandlers {

  static login(req, res) {
    inMemoryDB.db.get(`SELECT id FROM User WHERE username = ? AND password = ?`, [req.body.username, req.body.password], (error, row) => {
      if (error === null && row) {
          res.send({ id: row.id });
      } else {
          res.status(401).send();
      }
    });
  }

  static signup(req, res) {
    inMemoryDB.db.run(`INSERT INTO User(username, password, deleted) VALUES(?, ?, 0)`, [req.body.username, req.body.password], function(error) {
        if (error === null) {
          res.send({ id: this.lastID });  // id of inserted row
        } else {
          res.status(500).send(error);
        }
    });
  }
}