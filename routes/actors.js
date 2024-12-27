var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {log} = require("debug");
var async = require('async')


/* GET home page. */
router.get('/', function(req, res, next) {
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "actors",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    })

    axios.get(request_url).then(actors => {
        res.render('./actors/actors', { title: 'Actors', actors : actors.data.content });
    }).catch(error => {
        console.log(error);
    })
});

router.get('/id', async function (req, res, next) {
    let actor_data_request_url = url.build({
        host: global.SQLBrokerHost,
        path: "actors/id",
        query: {
            id: req.query.id,
        }
    })

    let movies_data_request_url = url.build({
        host: global.SQLBrokerHost,
        path: "movies/actor",
        query: {
            id: req.query.id,
        }
    })




    Promise.all([
         axios.get(actor_data_request_url).then(actor => {
        return actor.data;
        //res.render('./actors/single_actor', { title: 'Actors', actor : actor.data });
    }).catch(error => {
        console.log(error);
    }),
         axios.get(movies_data_request_url).then(movies => {
            return  movies.data;
            //res.render('./actors/single_actor', { title: 'Actors', actor : actor.data });
        }).catch(error => {
            console.log(error);
        })

    ]).then(result => {

        //todo: enable when NOSqlBroker is online
        /*
        let oscar_data_request_url = url.build({
            host: global.NoSQLBrokerHost,
            path: "actor",
            query: {
                name: result[0].name,
            }
        })

        axios.get(movies_data_request_url).then(oscar => {
            res.render('./actors/single_actor', {title: 'Actors', actor: result[0], movies: result[1], oscar: oscar.data});
        }).catch(error => {
            console.log(error);
        })
        */

        res.render('./actors/single_actor', {title: 'Actors', actor: result[0], movies: result[1]});
    })








});


module.exports = router;
