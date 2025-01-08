var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');


module.exports = (options) => {

    /**
     * Route to fetch all languages.
     * @name GET /languages
     */
    router.get('/', function (req, res, next) {
        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: "languages",
            query: {}
        }

        request_url = {
            ...request_url,
            query: {
                ...((req.query.page == null) ? {} : {page: req.query.page}),
                ...((req.query.size == null) ? {} : {size: req.query.size}),
                ...((req.query.sortParam == null) ? {} : {sortParam: req.query.sortParam}),
                ...((req.query.sortDirection == null) ? {} : {sortDirection: req.query.sortDirection})
            }
        }

        request_url = url.build(request_url);

        axios.get(request_url).then(languages => {

            res.render('./languages/languages', { title: 'Languages', languages: languages.data.content, pages: false });
        }).catch(error => {
            console.error("Error fetching languages:", error);
            res.status(500).render("error", {
                message: "Unable to fetch the list of languages."
            });
        });
    });

    /**
     * Route to fetch languages for a specific movie (by movieId).
     * @name GET /languages/language
     */
    router.get('/language', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: `languages/language`,
            query: {
                movieId: req.query.movieId,
            }
        })

        axios.get(movie_data_request_url).then(languages => {

            res.render('./languages/languages', {title: 'Language', languages: languages.data});
        }).catch(error => {
            console.error("Error fetching language by movie ID:", error);
            res.status(500).render("error", {
                message: "Unable to fetch languages for the specified movie."
            });
        });
    });

    /**
     * Route to fetch the top 10 languages.
     * @name GET /languages/top10-languages
     */
    router.get('/top10-languages', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: `languages/top10-languages`,
            query: {}
        })

        axios.get(movie_data_request_url).then(languages => {

            res.render('./languages/top10', {title: 'Language top10', languages: languages.data});
        }).catch(error => {
            console.error("Error fetching top 10 languages:", error);
            res.status(500).render("error", {
                message: "Unable to fetch the top 10 languages."
            });
        });
    });

    return router;
}

