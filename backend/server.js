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
app.use(cors()); // enable cors for a simple way to allow requests from the local frontend project on a different port. Obviously, we wouldn't do this in a real system.

await inMemoryDB.init();

app.get("/comments/:id", commentHandlers.getCommentById);
app.get("/comments", commentHandlers.getComments);
app.post("/comments", commentHandlers.createComment);
app.patch("/comments/:id", commentHandlers.updateComment);
app.delete("/comments/:id", commentHandlers.deleteComment);

app.get("/ratings/:id", ratingHandlers.getRatingById);
app.get("/ratings", ratingHandlers.getRatings);
app.post("/ratings", ratingHandlers.upsertRating);
app.delete("/ratings/:id", ratingHandlers.deleteRating);
app.get("/ratings/average/:isbn13", ratingHandlers.getAvgRating);

app.post("/users/login", userHandlers.login);
app.post("/users/signup", userHandlers.signup);

app.get("/nytbooks/overview", nytBooksHandlers.overview); // proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/overview.json
app.get("/nytbooks/:date/:list", nytBooksHandlers.list);  // proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/:date/:list.json

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});