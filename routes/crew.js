var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const res = require("express/lib/response");
const {render_error} = require("../utils");

module.exports = (options) => {

    /* GET home page. */
    router.get('/', function (req, res, next) {
        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: "crew",
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

        axios.get(request_url).then(crew => {
            res.render('./crew/crew', {title: 'Crew', crew: crew.data.content});
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    });

    router.get('/movie', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "crew/movie",
            query: {
                movieId: req.query.movieId,
            }
        })

        axios.get(movie_data_request_url).then(crew => {
            res.render('./crew/crew', {title: 'Crew', crew: crew.data});
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    })


    router.get('/*', function (req, res, next) {
        render_error(res, null, 404, "Page not found");
    })

    return router;

}
