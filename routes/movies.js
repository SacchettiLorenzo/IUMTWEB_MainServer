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

            //todo: if id == null render error page

            if (req.query.id === undefined || req.query.id === '' || req.query.id === null) {
                res.render('./error', {
                    message: 'No movie id'
                })
            } else {
                let movie_data_request_url = {
                    host: options.servers.SQLBrokerHost,
                    path: "movies/id",
                    query: {
                        id: req.query.id
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

                let similar_movie_data_request_url = {
                    host: options.servers.SQLBrokerHost,
                    path: "movies/similar",
                    query: {
                        id: req.query.id
                    }
                }

                similar_movie_data_request_url = url.build(similar_movie_data_request_url);

                Promise.all([
                    axios.get(movie_data_request_url).then(movie => {
                        return movie.data
                    }).catch(error => {
                        console.log(error);
                    }),
                    axios.get(actors_data_request_url).then(actors => {
                        return actors.data
                    }).catch(error => {
                        console.log(error);
                    }),
                    axios.get(similar_movie_data_request_url).then(actors => {
                        return actors.data
                    }).catch(error => {
                        console.log(error);
                    })
                ]).then(result => {
                    res.render('./movies/single_movie', {title: 'Movies', movie: result[0], actors: result[1], similar: result[2]});
                })
            }
        }
    )

    async function getMoviesFromDatabase(options) {
        const request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "movies",
            query: { size: 100 }
        });

        const response = await axios.get(request_url);
        return response.data.content; // Restituisci l'elenco dei film
    }

    async function getActorsFromDatabase(options) {
        const request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "actors",
            query: { size: 100 }
        });

        const response = await axios.get(request_url);
        return response.data.content; // Restituisci l'elenco degli attori
    }

    async function getNewsFromDatabase(options) {
        const request_url = url.build({
            host: options.servers.NoSQLBrokerHost,
            path: "news",
            query: { size: 100 }
        });

        const response = await axios.get(request_url);
        return response.data.content; // Restituisci l'elenco delle notizie
    }

    module.exports = {
        getMoviesFromDatabase,
        getActorsFromDatabase,
        getNewsFromDatabase
    };



    router.get('/stats', function (req, res, next) {

        let path = "movies/stats";

        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: path,
            query: {}
        }

        request_url = url.build(request_url);

        /*
        axios.get(request_url).then(movies => {
            res.render('./movies/movies_stats',
                {
                    title: 'Movies',
                    movies: movies.data
                });
        }).catch(error => {
            console.log(error);
        })
        */

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


        res.render('./movies/movies_stats');
    })

    return router;
}
