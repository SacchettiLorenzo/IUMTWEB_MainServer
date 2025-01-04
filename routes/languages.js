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
            path: "languages",
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

        axios.get(request_url).then(languages => {

            res.render('./languages/languages', { title: 'Languages', languages: languages.data.content, pages: false });
        }).catch(error => {
            console.log(error);
        });
    })


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
            console.log(error);
        })
    })


    router.get('/top10-languages', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: `languages/top10-languages`,
            query: {}
        })

        axios.get(movie_data_request_url).then(languages => {

            res.render('./languages/top10', {title: 'Language top10', languages: languages.data});
        }).catch(error => {
            console.log(error);
        })
    })







    return router;
}


/*
    QUERY
    -http://localhost:3000/languages visualizza tutte le lingue
    -http://localhost:3000/languages/language?movieId=1023319  per ottenere le lingue del film in base al suo id
    -http://localhost:3000/languages/top10 per ottenere una lista delle 10 lingue più usate
    


 */