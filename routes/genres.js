var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {log} = require("debug");
var async = require('async')
const res = require("express/lib/response");

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
    })


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
            console.log(error);
        })
    })







    return router;
}


/*
    QUERY
    -http://localhost:3000/genres visualizza tutti i generi
    -http://localhost:3000/genres/movie?movieId=1000001  per visualizzare tutti i generi in base all'id del film


 */
