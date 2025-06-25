import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import inMemoryDB from "./db.js";
import nytBooksHandlers from "./handlers/nytBooksHandlers.js";
import commentHandlers from "./handlers/commentHandlers.js";
import ratingHandlers from "./handlers/ratingHandlers.js";
import userHandlers from "./handlers/userHandlers.js";

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
const db = await inMemoryDB.init();

// ****************** CLEAN THIS OUT LATER ******************
// test data
let result = inMemoryDB.db.run(`INSERT INTO Comment(isbn13, userid, text, deleted) VALUES(?, ?, ?, ?)`, ["9798874620936", 1, "THIS IS A TEST COMMENT!", 0], (error) => {
  let res = result;
});
result = inMemoryDB.db.run(`INSERT INTO Comment(isbn13, userid, text, deleted) VALUES(?, ?, ?, ?)`, ["9798874620936", 2, "THIS IS ANOTHER TEST COMMENT!", 0], (error) => {
  let res = result;
});
result = inMemoryDB.db.run(`INSERT INTO Rating(isbn13, userid, score, deleted) VALUES(?, ?, ?, ?)`, ["9798874620936", 1, 3, 0], (error) => {
  let res = result;
});
result = inMemoryDB.db.run(`INSERT INTO Rating(isbn13, userid, score, deleted) VALUES(?, ?, ?, ?)`, ["9798874620936", 2, 4, 0], (error) => {
  let res = result;
});
result = inMemoryDB.db.run(`INSERT INTO User(username, password, deleted) VALUES(?, ?, ?)`, ["user1", "password111", 0], (error) => {
  let res = result;
});
result = inMemoryDB.db.run(`INSERT INTO User(username, password, deleted) VALUES(?, ?, ?)`, ["user2", "password222", 0], (error) => {
  let res = result;
});
result = inMemoryDB.db.all(`SELECT Comment.text, User.username FROM Comment INNER JOIN User ON Comment.userid = User.id`, (error, rows) => {
  let res = rows;
});

app.get("/comments/:id", commentHandlers.getCommentById);
app.get("/comments", commentHandlers.getComments);
app.post("/comments", commentHandlers.createComment);
app.patch("/comments/:id", commentHandlers.updateComment);   // just expects json body like { "text": "some new comment..."}
app.delete("/comments/:id", commentHandlers.deleteComment);

app.get("/ratings/:id", ratingHandlers.getRatingById);
app.get("/ratings", ratingHandlers.getRatings);
app.post("/ratings", ratingHandlers.createRating);
app.patch("/ratings/:id", ratingHandlers.updateRating);
app.delete("/ratings/:id", ratingHandlers.deleteRating);
app.get("/ratings/average/:isbn13", ratingHandlers.getAvgRating);

app.get("/users/:id", userHandlers.getUserById);
app.get("/users", userHandlers.getUser);      // expects credentials via basic authentication (header)
app.post("/users", userHandlers.createUser);  // expects credentials via basic authentication (header)

// proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/overview.json
// req should contain a query parameter "published_date" with a value in YYYY-MM-DD format
app.get("/nytbooks/overview", nytBooksHandlers.overview);
// proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/:date/:list.json
app.get("/nytbooks/:date/:list", nytBooksHandlers.list);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});