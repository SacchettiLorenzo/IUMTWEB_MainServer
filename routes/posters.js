const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url-composer');

router.get('/', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "posters",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./posters/posters', {title: 'Posters', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching posters.");
    }
})


router.get('/id', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "posters/id",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./posters/id', {title: 'Posters id', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching posters id.");
    }
})


module.exports = router;