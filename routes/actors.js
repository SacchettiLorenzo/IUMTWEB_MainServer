var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {log} = require("debug");
var async = require('async')


/* GET home page. */
router.get('/', function(req, res, next) {
    let request_url = url.build({
        host: global.host,
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
        host: global.host,
        path: "actors/id",
        query: {
            id: req.query.id,
        }
    })

    let movies_data_request_url = url.build({
        host: global.host,
        path: "movies/actor",
        query: {
            id: req.query.id,
        }
    })

    await Promise.all([
        await axios.get(actor_data_request_url).then(actor => {
        return actor.data;
        //res.render('./actors/single_actor', { title: 'Actors', actor : actor.data });
    }).catch(error => {
        console.log(error);
    }),
        await axios.get(movies_data_request_url).then(movies => {
            return  movies.data;
            //res.render('./actors/single_actor', { title: 'Actors', actor : actor.data });
        }).catch(error => {
            console.log(error);
        })

    ]).then(result => {
        res.render('./actors/single_actor', {title: 'Actors', actor: result[0], movies: result[1]});
    })








});


module.exports = router;
