import inMemoryDB from "../db.js";

export default class CommentHandlers {

    static getCommentById(req, res) {
      let sql = `SELECT Comment.id, Comment.text, User.username 
                  FROM Comment 
                  INNER JOIN User ON Comment.userid = User.id 
                  WHERE Comment.deleted = 0
                    AND Comment.id = ?`;
        inMemoryDB.db.get(sql, [req.params.id], (error, row) => {
            if (error === null) {
              res.send(row);
            } else {
              res.status(500).send(error);
            }
        });
    }

    static getComments(req, res) {
        let sql = `SELECT Comment.id, Comment.text, User.username 
                    FROM Comment 
                    INNER JOIN User ON Comment.userid = User.id 
                    WHERE Comment.deleted = 0`;
        let sqlParams = [];

        if (req.query.isbn13) {
            sql += ` AND Comment.isbn13 = ?`;
            sqlParams.push(req.query.isbn13);
        }
        if (req.query.userid) {
            sql += ` AND Comment.userid = ?`;
            sqlParams.push(req.query.userid);
        }
        sql += ` ORDER BY Comment.id ASC`;

        inMemoryDB.db.all(sql, sqlParams, (error, rows) => {
            if (error === null) {
              res.send(rows);
            } else {
              res.status(500).send(error);
            }
        });
    }

    static createComment(req, res) {
        inMemoryDB.db.run(`INSERT INTO Comment(isbn13, userid, text, deleted) VALUES(?, ?, ?, 0)`, [req.body.isbn13, req.body.userid, req.body.text], function(error) {
            if (error === null) {
              res.send({id: this.lastID});  // id of inserted row
            } else {
              res.status(500).send(error);
            }
        });
    }

    static updateComment(req, res) {
        inMemoryDB.db.run(`UPDATE Comment SET text = ? WHERE id = ?`, [req.body.text, req.params.id], (error) => {
            if (error === null) {
              res.send();
            } else {
              res.status(500).send(error);
            }
        });
    }

    static deleteComment(req, res) {
      inMemoryDB.db.run(`UPDATE Comment SET deleted = 1 WHERE id = ?`, [req.params.id], (error) => {
            if (error === null) {
              res.send();
            } else {
              res.status(500).send(error);
            }
        });
    }
}