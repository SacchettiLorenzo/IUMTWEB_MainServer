var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');


var movies = []

module.exports = (options) => {


    /* GET home page. */
    router.get('/', function (req, res, next) {

        let path = "movies";

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

        axios.get(request_url).then(movies => {
            console.log(movies);
            res.render('./movies/movie',
                {
                    title: 'Movies',
                    movies: movies.data.content,
                    path: path,
                    pages: true,
                    pages_amount: (movies.data.totalPages - 1),
                    current_page: movies.data.number,
                    page_size: movies.data.size
                });

        }).catch(error => {
            console.log(error);
        })
    });

    router.get('/name', function (req, res, next) {

        let path = "movies/name";

        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: path,
            query: {}
        }

        request_url = {
            ...request_url,
            query: {
                ...((req.query.partial == null) ? {} : {partial: req.query.partial}),
            }
        }

        request_url = url.build(request_url);

        axios.get(request_url).then(movies => {
            res.render('./movies/movie',
                {
                    title: 'Movies',
                    movies: movies.data,
                    path: path,
                    pages: true,
                    pages_amount: (movies.data.totalPages - 1),
                    current_page: movies.data.number,
                    page_size: movies.data.size
                });
        }).catch(error => {
            console.log(error);
        })
    })

    router.get('/id', function (req, res, next) {
        let movie_data_request_url = {
            host: options.servers.SQLBrokerHost,
            path: "movies/id",
            query: {}
        }

        movie_data_request_url = {
            ...movie_data_request_url,
            query: {
                ...((req.query.id == null) ? {} : {id: req.query.id}),
            }
        }

        movie_data_request_url = url.build(movie_data_request_url);

        let actors_data_request_url = {
            host: options.servers.SQLBrokerHost,
            path: "actors/movie",
            query: {
                movieId: req.query.id
            }
        }

        actors_data_request_url = url.build(actors_data_request_url);

        Promise.all([
            axios.get(movie_data_request_url).then(movie => {
                return movie.data
                //res.render('./movies/single_movie', { title: 'Movies', movie : movie.data });
            }).catch(error => {
                console.log(error);
            }),
            axios.get(actors_data_request_url).then(actors => {
                return actors.data
                //res.render('./movies/single_movie', { title: 'Movies', movie : movie.data });
            }).catch(error => {
                console.log(error);
            })
        ]).then(result => {
            res.render('./movies/single_movie', {title: 'Movies', movie: result[0], actors: result[1]});
        })
    })

    return router;
}
