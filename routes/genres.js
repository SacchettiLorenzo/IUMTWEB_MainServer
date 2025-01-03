var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {log} = require("debug");
var async = require('async')
const res = require("express/lib/response");

module.exports = (options) => {

    router.get('/', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "genres",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });
module.exports = (options) => {

    router.get('/', function (req, res, next) {
        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: "genres",
            query: {}
        }

        // Costruzione dei parametri per la query
        request_url = {
            ...request_url,
            query: {
                ...((req.query.page == null) ? {} : {page: req.query.page}),
                ...((req.query.size == null) ? {} : {size: req.query.size}),
                ...((req.query.sortParam == null) ? {} : {sortParam: req.query.sortParam}),
                ...((req.query.sortDirection == null) ? {} : {sortDirection: req.query.sortDirection})
            }
        }

        // Composizione dell'URL finale
        request_url = url.build(request_url);

        axios.get(request_url).then(genres => {

            res.render('./genres/genres', { title: 'Genres', genres: genres.data.content, pages: false });
        }).catch(error => {
            console.log(error);
        });
    });

        try {
            const response = await axios.get(request_url);
            res.render('./genres/genres', {title: 'Genres', themes: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching genres.");
        }
    })


    router.get('/movie', function (req, res, next) {
        if (!req.query.movieId) {
            return res.status(400).send('movieId is required');
        }

    router.get('/id', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "genres/id",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "genres/movie",
            query: {
                movieId: req.query.movieId,
            }
        })

        try {
            const response = await axios.get(request_url);
            res.render('./genres/id', {title: 'Genres id', themes: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching genres id.");
        }
    })
        axios.get(movie_data_request_url).then(response => {

            const genre = response.data.genre;
            res.render('genres/genres', { title: 'Movie Genre', genre: genre });
        }).catch(error => {
            console.log(error);
        })
    });

    router.get('/id', function (req, res, next) {
        if (!req.query.movieId) {
            return res.status(400).send('movieId is required');
        }

    router.get('/ids', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "genres/ids",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });
        let genre_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "genres/id",
            query: {
                id: req.query.id,
            }
        })

        try {
            const response = await axios.get(request_url);
            res.render('./genres/ids', {title: 'Genres ids', themes: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching genres ids.");
        }
    })
        axios.get(genre_data_request_url).then(response => {

            const genre = response.data.genre;
            res.render('genres/genres', { title: 'Genre id', genre: genre });
        }).catch(error => {
            console.log(error);
        })
    });




        try {
            const response = await axios.get(request_url);
            res.render('./genres/top10', {title: 'Genres top 10', themes: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching genres top10.");
        }
    })
    return router;
}





    return router;

}