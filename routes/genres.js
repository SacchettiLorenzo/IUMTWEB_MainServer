const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url-composer');


router.get('/', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "genres",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./genres/genres', {title: 'Genres', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching genres.");
    }
})


router.get('/id', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "genres/id",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./genres/id', {title: 'Genres id', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching genres id.");
    }
})


router.get('/ids', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "genres/ids",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./genres/ids', {title: 'Genres ids', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching genres ids.");
    }
})

router.get('/top10', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "genres/top10",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./genres/top10', {title: 'Genres top 10', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching genres top10.");
    }
})

module.exports = router;