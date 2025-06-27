import inMemoryDB from "./../db.js";

export default class RatingHandlers {
    
    static getRatingById(req, res) {
        inMemoryDB.db.get(`SELECT * FROM Rating WHERE id = ? AND deleted = 0`, [req.params.id], (error, row) => {
            if (error === null) {
                res.send(row);
            } else {
                res.status(500).send(error);
            }
        });
    }
    
    static getRatings(req, res) {
        let sql = `SELECT * FROM Rating WHERE deleted = 0`;
        let sqlParams = [];
        
        if (req.query.isbn13) {
            sql += ` AND isbn13 = ?`;
            sqlParams.push(req.query.isbn13);
        }
        if (req.query.userid) {
            sql += ` AND userid = ?`;
            sqlParams.push(req.query.userid);
        }
        sql += ` ORDER BY Rating.id ASC`;

        inMemoryDB.db.all(sql, sqlParams, (error, rows) => {
            if (error === null) {
                res.send(rows);
            } else {
                res.status(500).send(error);
            }
        });
    }

    // since there can only be one rating per (user, isbn13), an upsert simplifies things.
    static upsertRating(req, res) {
        const sql = `INSERT INTO Rating(isbn13, userid, score, deleted) VALUES(?, ?, ?, 0)
                        ON CONFLICT(isbn13, userid) DO UPDATE SET score = ?, deleted = 0`;
        const sqlParams = [req.body.isbn13, req.body.userid, req.body.score, req.body.score];
        inMemoryDB.db.run(sql, sqlParams, function(error) {
            if (error === null) {
                res.send({id: this.lastID});  // id of inserted row
            } else {
                res.status(500).send(error);
            }
        });
    }

    static deleteRating(req, res) {
        inMemoryDB.db.run(`UPDATE Rating SET deleted = 1 WHERE id = ?`, [req.params.id], (error) => {
            if (error === null) {
                res.send();
            } else {
                res.status(500).send(error);
            }
        });
    }

    static getAvgRating(req, res) {
        inMemoryDB.db.get(`SELECT ROUND(AVG(score),1) AS avg FROM Rating WHERE deleted = 0 AND isbn13 = ?`, [req.params.isbn13], (error, row) => {
            if (error === null) {
                res.send(row);
            } else {
                res.status(500).send(error);
            }
        });
    }
}