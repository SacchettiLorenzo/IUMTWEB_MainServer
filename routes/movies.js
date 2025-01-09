var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {render_error} = require("../utils");


var movies = []

module.exports = (options) => {

    router.get('/', function (req, res, next) {

        let genres_path = "genres";
        let genres_request_url = {
            host: options.servers.SQLBrokerHost,
            path: genres_path,
            query: {
                page: 0,
                size: 1000,
            }
        };

        genres_request_url = url.build(genres_request_url);

        let path = "movies";

        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: path,
            query: {}
        };

        request_url = {
            ...request_url,
            query: {
                ...((req.query.page == null) ? {} : {page: req.query.page}),
                ...((req.query.size == null) ? {} : {size: req.query.size}),
                ...((req.query.sortParam == null) ? {} : {sortParam: req.query.sortParam}),
                ...((req.query.sortDirection == null) ? {} : {sortDirection: req.query.sortDirection})
            }
        };

        request_url = url.build(request_url);

        Promise.all([
            axios.get(genres_request_url).then(genres => {
                return genres;
            }),
            axios.get(request_url).then(movies => {
                return movies;
            })
        ]).then((results) => {
            let genres = results[0];
            let movies = results[1];
            res.render('./movies/movie',
                {
                    title: 'Movies',
                    movies: movies.data.content,
                    genres: genres.data.content,
                    path: path,
                    pages: true,
                    searchable: true,
                    pages_amount: (movies.data.totalPages - 1),
                    current_page: movies.data.number,
                    page_size: movies.data.size,
                    query_params: "&sortParam=" + req.query.sortParam + "&sortDirection=" + req.query.sortDirection,
                });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
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

            if (req.query.only_data === "true") {
                res.send(movies.data);
            } else {
                res.render('./movies/movie',
                    {
                        title: 'Movies',
                        movies: movies.data,
                        path: path,
                        //pages: true,
                        searchable: true,
                        //pages_amount: (movies.data.totalPages - 1),
                        //current_page: movies.data.number,
                        //page_size: movies.data.size
                    });
            }

        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    })

    router.get('/id', function (req, res, next) {

        // Controlla se l'ID del film è stato fornito
        if (req.query.id === undefined || req.query.id === '' || req.query.id === null) {
            res.render('./error', {
                message: 'No movie id'
            });
        } else {
            // URL per ottenere i dettagli del film
            let movie_data_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "movies/id",
                query: {
                    id: req.query.id
                }
            };

            movie_data_request_url = url.build(movie_data_request_url);

            // URL per ottenere gli attori del film
            let actors_data_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "actors/movie",
                query: {
                    movieId: req.query.id
                }
            };

            actors_data_request_url = url.build(actors_data_request_url);

            // URL per ottenere le lingue del film
            let languages_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "languages/language",
                query: {
                    movieId: req.query.id
                }
            };

            languages_request_url = url.build(languages_request_url);

            // URL per ottenere i generi del film
            let genres_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "genres/movie",
                query: {
                    movieId: req.query.id
                }
            };

            genres_request_url = url.build(genres_request_url);

            // URL per ottenere i paesi del film
            let countries_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "countries/id",
                query: {
                    movieId: req.query.id
                }
            };

            countries_request_url = url.build(countries_request_url);

            // URL per ottenere i temi del film
            let themes_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "themes/theme",
                query: {
                    movieId: req.query.id
                }
            };

            themes_request_url = url.build(themes_request_url);

            let releases_request_url = {
                host: options.servers.SQLBrokerHost,
                path: "releases/movie",
                query: {
                    movieId: req.query.id
                }
            };

            releases_request_url = url.build(releases_request_url);



            Promise.all([
                axios.get(movie_data_request_url).then(movie => {
                    return movie.data
                }),
                axios.get(actors_data_request_url).then(actors => {
                    return actors.data
                }),
                axios.get(languages_request_url).then(languages => {
                    return languages.data; // Le lingue del film
                }),
                axios.get(genres_request_url).then(genres => {
                    return genres.data; // I generi del film
                }),
                axios.get(countries_request_url).then(countries => {
                    return countries.data; // I paesi del film
                }),
                axios.get(themes_request_url).then(themes => {
                    return themes.data; // I temi del film
                }),
                axios.get(releases_request_url).then(releases => {
                    return releases.data; // I temi del film
                })
            ]).then(result => {
                let movie = result[0];

                if(movie == null || movie == undefined || movie == "") {
                    render_error(res, null, 404, "Unable to find movie with requested id");
                    return
                }

                let actors = result[1];
                let languages = result[2];
                let genres = result[3];
                let countries = result[4];
                let themes = result[5];
                let releases = result[6];

                let reviews_data_request_url = {
                    host: options.servers.NoSQLBrokerHost,
                    path: "review/movie/:title",
                    params: {
                        title: movie.name
                    }
                }

                reviews_data_request_url = url.build(reviews_data_request_url);

                let oscars_data_request_url = {
                    host: options.servers.NoSQLBrokerHost,
                    path: "oscar/film/:title",
                    params: {
                        title: movie.name
                    }
                }

                oscars_data_request_url = url.build(oscars_data_request_url);

                Promise.all([
                    axios.get(reviews_data_request_url).then(reviews => {
                        return reviews.data
                    }),
                    axios.get(oscars_data_request_url).then(oscars_response => {
                        return oscars_response.data
                    })
                ]).then(result => {
                    let reviews_;

                    if (result[0] != null) {
                        reviews_ = result[0].reviews;
                    }

                    let oscarsByFilm_;

                    if (result[1] != null) {
                        oscarsByFilm_ = result[1][0];
                    }

                    res.render('./movies/single_movie', {
                        title: 'Movies',
                        page: "single_movie",
                        movie_title: movie.name,
                        movie: movie,
                        actors: actors,
                        reviews: reviews_,
                        languages: languages,
                        genres: genres,
                        countries: countries,
                        themes: themes,
                        releases: releases,
                        oscarsByFilm: oscarsByFilm_
                        //similar: result[2]
                    });
                }).catch(error => {
                    render_error(res, error, 500, "Internal Server Error");
                })
            })
        }
    });

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
            }),
            axios.get(genres_request_url).then(genres => {
                return genres.data.content;
            }),
            axios.get(languages_request_url).then(languages => {
                return languages.data.content;
            }),
            axios.get(themes_request_url).then(themes => {
                return themes.data.content;
            })
        ]).then(result => {
            res.render('./movies/movies_search', {
                title: 'Movies',
                countries: result[0],
                genres: result[1],
                languages: result[2],
                themes: result[3]
            });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    })

    router.get('/filter/table', function (req, res, next) {
        try {
            res.sendFile('views/movies/movies_table.hbs', {root: '.'})
        } catch (error) {
            render_error(res, error, 400, "Unable to send component");
        }

    });

    router.get('/filter', function (req, res, next) {

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
            res.send(movies.data);
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    });


    router.get('/genres', (req, res, next) => {
        const genresId = req.query.genresId || 1;  // Imposta un genere di default se non fornito
        const page = req.query.page || 0;
        const size = req.query.size || 10;
        let path = "movies/genres";

        // Richiesta per caricare i generi
        let genres_path = "genres";
        let genres_request_url = {
            host: options.servers.SQLBrokerHost,
            path: genres_path,
            query: {
                page: 0,
                size: 1000,
            }
        };

        genres_request_url = url.build(genres_request_url);

        axios.get(genres_request_url).then(genres => {

            // Richiesta per ottenere i film per il genere selezionato
            const request_url = url.build({
                host: options.servers.SQLBrokerHost,
                path: path,
                query: {
                    page: page,
                    size: size,
                    genresId: genresId
                }
            });

            axios.get(request_url)
                .then(movies => {
                    res.render('./movies/movies_table_view', {
                        title: 'Movies - Filtered by Genre',
                        movies: movies.data.content,
                        genresId: genresId,
                        genres: genres.data.content, // Passa anche i generi
                        path: 'movies/genres',
                        query_params: 'genresId=' + genresId,
                        pages: true,
                        searchable: true,
                        pages_amount: (movies.data.totalPages - 1),
                        current_page: movies.data.number,
                        page_size: movies.data.size
                    });
                })
                .catch(error => {
                    render_error(res, error, 500, "Internal Server Error");
                });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    });


    router.get('/top10-movies', function (req, res, next) {
        let type = req.query.type || 'best';
        let countryId = req.query.countryId || '';
        let genreId = req.query.genreId || '';
        let languageId = req.query.languageId || '';

        const queryParams = {};
        if (countryId) queryParams.countryId = countryId;
        if (genreId) queryParams.genreId = genreId;
        if (languageId) queryParams.languageId = languageId;

        let path;
        let minuteSort = null;
        let ratingSort = null;
        let sortDirection = 'DESC'; // Default sorting direction, can be modified

        if (type === 'best') {
            path = "movies/top10ByIds";
            ratingSort = 1; // Ordina per rating
            sortDirection = 'DESC'; // Ordinamento decrescente per rating
        } else if (type === 'worst') {
            path = "movies/worst10ByIds";
            ratingSort = 1; // Ordina per rating
            sortDirection = 'ASC'; // Ordinamento crescente per rating
        } else if (type === 'longest') {
            path = "movies/top10Longest";
            minuteSort = 1; // Ordina per durata
            sortDirection = 'DESC'; // Ordinamento decrescente per durata
        } else if (type === 'shortest') {
            path = "movies/top10Shortest";
            minuteSort = 1; // Ordina per durata
            sortDirection = 'ASC'; // Ordinamento crescente per durata
        }

        // Aggiungi i parametri di ordinamento
        queryParams.minuteSort = minuteSort;
        queryParams.ratingSort = ratingSort;
        queryParams.sortDirection = sortDirection;

        let topMovies_request_url = {
            host: options.servers.SQLBrokerHost,
            path: path,
            query: queryParams
        };

        let countries_path = "countries";
        let genres_path = "genres";
        let languages_path = "languages";

        Promise.all([
            axios.get(url.build({
                host: options.servers.SQLBrokerHost,
                path: countries_path,
                query: {page: 0, size: 1000}
            }))
                .then(countries => countries.data.content),
            axios.get(url.build({host: options.servers.SQLBrokerHost, path: genres_path, query: {page: 0, size: 1000}}))
                .then(genres => genres.data.content),
            axios.get(url.build({
                host: options.servers.SQLBrokerHost,
                path: languages_path,
                query: {page: 0, size: 1000}
            }))
                .then(languages => languages.data.content),
            axios.get(url.build(topMovies_request_url))
                .then(topMovies => topMovies.data)
        ]).then(result => {
            res.render('./movies/top10', {
                title: type === 'best' ? 'Top 10 Best Movies' : (type === 'worst' ? 'Top 10 Worst Movies' : (type === 'longest' ? 'Top 10 Longest Movies' : 'Top 10 Shortest Movies')),
                movies: result[3],
                countries: result[0],
                genres: result[1],
                languages: result[2],
                selectedCountryId: countryId,
                selectedGenreId: genreId,
                selectedLanguageId: languageId,
                type: type
            });
        }).catch(error => {
            render_error(res,error,500,"Internal Server Error");
        });
    });

    router.get('/*', function (req, res, next) {
        render_error(res, null, 404, "Page not found");
    })


    return router;
}
