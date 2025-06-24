import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import InMemoryDB from "./db.js";

// direct dotenv to the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/.env`})

// configure express server
const app = express();
const port = 8080;
app.use(express.json());
app.use(cors()) // allow CORS so that the frontend app can make requests while running on a different port

// instantiate database
const db = await InMemoryDB.init();
var result = db.run(`INSERT INTO Comment(isbn13, userid, deleted) VALUES(?, ?, ?)`, ["123", 12, 0], (error) => {
  var res = result;
});
var restult2 = db.get(`SELECT * FROM Comment`, (error, row) => {
  var res = result;
});


// get by id
app.get("/comments/:id", (req, res) => {
  db.get(`SELECT * FROM Comment WHERE id = ?`, [req.params.id], (error, row) => {
    if (error === null) {
      res.send(row);
    } else {
      res.status(500).send(error);
    }
  });
});

// get by isbn13 (returns a list)
// expects query parameter "isbn13" which is the isbn of the book that the comments relate to
// returns a list of comments
app.get("/comments", (req, res) => {
  db.all(`SELECT * FROM Comment WHERE isbn13 = ?`, [req.query.isbn13], (error, rows) => {
    if (error === null) {
      res.send(rows);
    } else {
      res.status(500).send(error);
    }
  });
});

// create a comment
app.post("/comments", (req, res) => {
  db.run(`INSERT INTO Comment(isbn13, userid, text, deleted) VALUES(?, ?, ?, 0)`, [req.body.isbn13, req.body.userid, req.body.text], function(error) {
    if (error === null) {
      res.send({id: this.lastID});  // id of inserted row
    } else {
      res.status(500).send(error);
    }
  });
});

// udpate a comment
// just expects json body like { "text": "some new comment..."}
app.patch("/comments/:id", (req, res) => {
  db.run(`UPDATE Comment SET text = ? WHERE id = ${req.params.id}`, [req.body.text], (error) => {
    if (error === null) {
      res.send();
    } else {
      res.status(500).send(error);
    }
  });
});

// delete a comment
// expects query parameter "id"
app.delete("/comments/:id", (req, res) => {
  db.run(`UPDATE Comment SET deleted = 1 WHERE id = ?`, [req.params.id], (error) => {
    if (error === null) {
      res.send();
    } else {
      res.status(500).send(error);
    }
  });
});


// proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/overview.json
// req should contain a query parameter "published_date" with a value in YYYY-MM-DD format
app.get("/nytbooks/overview", (req, res) => {
  const url = new URL(`${process.env.NYT_BASE_URL}/overview.json`);
  const urlParams = new URLSearchParams({ "api-key": process.env.API_KEY, published_date: req.query.published_date });
  url.search = urlParams.toString();

  fetch(url)
    .then(nytResponse => {
      res.statusCode = nytResponse.status;
      nytResponse.json().then(data => {
        res.send(data);
      });
    })
    .catch(error => {
      res.statusCode = 400;
      res.send({ status: "ERROR", error: "something went wrong"});
    });
});


// proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/:date/:list.json
app.get("/nytbooks/:date/:list", (req, res) => {
  const url = new URL(`${process.env.NYT_BASE_URL}/${req.params.date}/${req.params.list}.json`);
  const urlParams = new URLSearchParams({ "api-key": process.env.API_KEY });
  url.search = urlParams.toString();

  fetch(url)
    .then(nytResponse => {
      res.statusCode = nytResponse.status;
      nytResponse.json().then(data => {
        res.send(data);
      });
    })
    .catch(error => {
      res.statusCode = 400;
      res.send({ status: "ERROR", error: "something went wrong"});
    });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});