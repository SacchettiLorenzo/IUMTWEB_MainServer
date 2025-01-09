var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {render_error} = require("../utils");


module.exports = (options) => {

    /**
     * Route to fetch all genres.
     * @name GET /genres
     */
    router.get('/', function (req, res, next) {
        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: "genres",
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

        axios.get(request_url).then(genres => {

            res.render('./genres/genres', { title: 'Genres', genres: genres.data.content, pages: false });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    })

    /**
     * Route to fetch genres for a specific movie (by movieId).
     * @name GET /genres/movie
     */
    router.get('/movie', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: `genres/movie`,
            query: {
                movieId: req.query.movieId,
            }
        })

        axios.get(movie_data_request_url).then(genres => {

            res.render('./genres/genres', {title: 'Genres', genres: genres.data});
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    });

    /**
     * Route to fetch top genres.
     * @name GET /genres/top-genres
     */
    router.get('/top-genres', function (req, res, next) {
        let topGenresRequestUrl = url.build({
            host: options.servers.SQLBrokerHost,
            path: 'genres/trending'
        });

        axios.get(topGenresRequestUrl).then(response => {

            const genres = response.data.map(genres => ({
                id: genres.id,
                genre: genres.genre,
                movie_count: genres.movie_count
            }));
            console.log(genres.id);

            res.render('./genres/top-genres', {
                title: 'Top 10 Genres',
                type: 'genre',
                genres: genres
            });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    });


    return router;
}

