var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {log} = require("debug");
var async = require('async')
const res = require("express/lib/response");
const {render_error} = require("../utils");

function filter_actors_summary(actors){
    actors.forEach((actor) => {
        if(actor.section === "" || actor.imageUrl === ""){
            actor.summary = "";
        }
    })
    return actors;
}

module.exports = (options) => {

    router.get('/', function (req, res, next) {
        let request_url = {
            host: options.servers.SQLBrokerHost,
            path: "actors",
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

        axios.get(request_url).then(actors => {
            actors.data.content = filter_actors_summary(actors.data.content);

            res.render('./actors/actors', {title: 'Actors', actors: actors.data.content, pages : false});
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    });

    router.get('/movie', function (req, res, next) {
        let movie_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "actors/movie",
            query: {
                movieId: req.query.movieId,
            }
        })

        axios.get(movie_data_request_url).then(actors => {
            actors.data = filter_actors_summary(actors.data);
            res.render('./actors/actors', {title: 'Actors', actors: actors.data});
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })
    })

    router.get('/id', async function (req, res, next) {
        let actor_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "actors/id",
            query: {
                id: req.query.id,
            }
        })

        let movies_data_request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "movies/actor",
            query: {
                id: req.query.id,
            }
        })


        Promise.all([
            axios.get(actor_data_request_url).then(actor => {
                actor.data = filter_actors_summary([actor.data])[0];
                return actor.data;
            }).catch(error => {
                console.log(error);
            }),
            axios.get(movies_data_request_url).then(movies => {
                return movies.data;
            }).catch(error => {
                console.log(error);
            })

        ]).then(result => {
            res.render('./actors/single_actor', {
                title: 'Actors',
                actor: result[0],
                movies: result[1]
            });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        })


    });


    router.get('/top10-mostPopularActors', async (req, res, next) => {
        try {
            const topActorsRequestUrl = url.build({
                host: options.servers.SQLBrokerHost,
                path: 'actors/top10-mostPopularActors'
            });

            const response = await axios.get(topActorsRequestUrl);
            const actors = response.data;

            res.render('./actors/top-actors', {
                title: 'Top 10 Actors with Most Appearances',
                actors: actors, // Per la tabella
                actorsJson: JSON.stringify(actors) // Per il grafico
            });
        }catch{
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    router.get('/*', function (req, res, next) {
        render_error(res, null, 404, "Page not found");
    })

return router;
}
