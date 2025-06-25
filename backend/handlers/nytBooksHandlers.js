import inMemoryDB from "./../db.js";

export default class NYTBooksHandlers {

    static overview(req, res) {
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
    }

    static list(req, res) {
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
    }
}