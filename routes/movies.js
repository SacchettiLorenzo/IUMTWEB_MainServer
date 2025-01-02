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
        query: {
            ...((req.query.page == null) ? {} : { page: req.query.page }),
            ...((req.query.size == null) ? {} : { size: req.query.size }),
            ...((req.query.sortParam == null) ? {} : { sortParam: req.query.sortParam }),
            ...((req.query.sortDirection == null) ? {} : { sortDirection: req.query.sortDirection }),
            ...((req.query.title == null) ? {} : { title: req.query.title }) // Filtro per titolo
        }
    };

    request_url = url.build(request_url);

    axios.get(request_url).then(movies => {
        res.render('./movies/movie', { title: 'Movies', movies : movies.data.content });
    }).catch(error => {
        console.log(error);
    })
});

router.get('/titles', async (req, res) => {
    try {
        let request_url = {
            host: global.SQLBrokerHost,
            path: "movies",
            query: { size: 100 } // Ottieni i primi 100 film
        };

        request_url = url.build(request_url);

        const response = await axios.get(request_url);
        const movieTitles = response.data.content.map(movie => movie.title);

        res.json(movieTitles);
    } catch (error) {
        console.error('Error retrieving movie titles:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
