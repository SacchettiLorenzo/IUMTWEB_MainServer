var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');


var movies = []

/* GET home page. */
router.get('/', function(req, res, next) {
    let request_url = url.build({
        host: "http://localhost:8080",
        path: "movies",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    })

    axios.get(request_url).then(movies => {
        res.render('./movies/movie', { title: 'Movies', movies : movies.data.content });
    }).catch(error => {
        console.log(error);
    })
});


module.exports = router;
