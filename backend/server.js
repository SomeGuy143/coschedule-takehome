import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from "path";

// direct dotenv to the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/.env`})

const app = express();
const port = 8080;
app.use(express.json());


// proxy endpoint for https://api.nytimes.com/svc/books/v3/lists/overview.json
// req should contain a query parameter "published_date" with a value in YYYY-MM-DD format
app.get('/nytbooks/overview', (req, res) => {
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
app.get('/nytbooks/:date/:list', (req, res) => {
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