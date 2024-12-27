var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');


var movies = []

/* GET home page. */
router.get('/', function(req, res, next) {

    let request_url = {
        host: global.SQLBrokerHost,
        path: "movies",
        query: {
        }
    }

    request_url = {
        ...request_url,
        query : {
            ... ((req.query.page == null) ? {} : {page: req.query.page}),
            ... ((req.query.size == null) ? {} : {size: req.query.size}),
            ... ((req.query.sortParam == null) ? {} : {sortParam: req.query.sortParam}),
            ... ((req.query.sortDirection == null) ? {} : {sortDirection: req.query.sortDirection})
        }
    }

    request_url = url.build(request_url);

    axios.get(request_url).then(movies => {
        res.render('./movies/movie', { title: 'Movies', movies : movies.data.content });
    }).catch(error => {
        console.log(error);
    })
});


module.exports = router;
