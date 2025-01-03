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
            res.render('./movies/movie',
                {
                    title: 'Movies',
                    movies: movies.data.content,
                    path: path,
                    pages: true,
                    searchable: true,
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
                    searchable: true,
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
                    axios.get(similar_movie_data_request_url).then(similar => {
                        return similar.data
                    }).catch(error => {
                        console.log(error);
                    })
                ]).then(result => {
                    res.render('./movies/single_movie', {
                        title: 'Movies',
                        movie: result[0],
                        actors: result[1],
                        similar: result[2]
                    });
                })
            }
        }
    )


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
        res.render('./movies/movies_stats');
    })

    router.get('/titles', async (req, res) => {
        try {
            let request_url = {
                host: global.SQLBrokerHost,
                path: "movies",
                query: {size: 100} // Ottieni i primi 100 film
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

    router.get('/search', function (req, res, next) {

        let countries_path = "countries";

        let countries_request_url = {
            host: options.servers.SQLBrokerHost,
            path: countries_path,
            query: {
                page: 0,
                size: 1000,
            }
        }

        countries_request_url = url.build(countries_request_url);

        let genres_path = "genres";

        let genres_request_url = {
            host: options.servers.SQLBrokerHost,
            path: genres_path,
            query: {
                page: 0,
                size: 1000,
            }
        }

        genres_request_url = url.build(genres_request_url);

        let languages_path = "languages";

        let languages_request_url = {
            host: options.servers.SQLBrokerHost,
            path: languages_path,
            query: {
                page: 0,
                size: 1000,
            }
        }

        languages_request_url = url.build(languages_request_url);

        let themes_path = "themes";

        let themes_request_url = {
            host: options.servers.SQLBrokerHost,
            path: themes_path,
            query: {
                page: 0,
                size: 1000,
            }
        }

        themes_request_url = url.build(themes_request_url);

        Promise.all([
            axios.get(countries_request_url).then(countries => {
                return countries.data.content;
            }).catch(error => {
                console.log(error);
            }),
            axios.get(genres_request_url).then(genres => {
                return genres.data.content;
            }).catch(error => {
                console.log(error);
            }),
            axios.get(languages_request_url).then(languages => {
                return languages.data.content;
            }).catch(error => {
                console.log(error);
            }),
            axios.get(themes_request_url).then(themes => {
                return themes.data.content;
            }).catch(error => {
                console.log(error);
            })
        ]).then(result => {
            res.render('./movies/movies_search', {title: 'Movies', countries: result[0], genres: result[1],languages: result[2],themes: result[3]});
        })
    })

    router.get('/filter/table', function (req, res, next) {
        res.sendFile('views/movies/movies_table.hbs', { root: '.' })
    });

    router.get('/filter', function (req, res, next) {
        console.log(req.query);


        let path = "movies/filter";

        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: path,
            query: {}
        }

        request_url = {
            ...request_url,
            query: {
                ...((req.query.country == null) ? {} : {countries_id: req.query.country}),
                ...((req.query.genre == null) ? {} : {genres_id: req.query.genre}),
                ...((req.query.language == null) ? {} : {languages_id: req.query.language}),
                ...((req.query.theme == null) ? {} : {themes_id: req.query.theme}),
                ...((req.query.date == null) ? {} : {date: req.query.date})
            }
        }

        request_url = url.build(request_url);

        axios.get(request_url).then(movies => {
            console.log(movies.data);
            res.send(movies.data);
        }).catch(error => {
            console.log(error);
        })


    });

    return router;
}
