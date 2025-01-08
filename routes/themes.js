var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');


module.exports = (options) => {

    /**
     * Route to fetch all themes.
     * @name GET /themes
     */
    router.get('/', function (req, res, next) {

        let path = "themes";

        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: path,
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

        axios.get(request_url).then(themes => {
            console.log(themes);
            res.render('./themes/theme_home',
                {
                    title: 'Themes',
                    themes: themes.data.content,
                    path: path,
                    pages: true,
                    pages_amount: (themes.data.totalPages - 1),
                    current_page: themes.data.number,
                    page_size: themes.data.size
                });

        }).catch(error => {
            console.error("Error fetching themes:", error);
            res.status(500).render("error", {
                message: "Unable to fetch the list of themes."
            });
        });
    });

    /**
     * Route to fetch a theme for a specific movie (by movieId).
     * @name GET /themes/theme
     */
    router.get('/theme', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: `themes/theme`,
            query: {
                movieId: req.query.movieId,
            }
        })

        axios.get(movie_data_request_url).then(themes => {

            res.render('./themes/themes', {title: 'Theme', themes: themes.data});
        }).catch(error => {
            console.error("Error fetching theme by movie ID:", error);
            res.status(500).render("error", {
                message: "Unable to fetch the theme for the specified movie."
            });
        });
    })

    /**
     * Route to fetch the top 10 themes.
     * @name GET /themes/top10
     */
    router.get('/top10', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: `themes/top10`,
            query: {}
        })

        axios.get(movie_data_request_url).then(themes => {

            res.render('./themes/top10', {title: 'Themes top10', themes: themes.data});
        }).catch(error => {
            console.error("Error fetching top 10 themes:", error);
            res.status(500).render("error", {
                message: "Unable to fetch the top 10 themes."
            });
        });
    })

    return router;
}
