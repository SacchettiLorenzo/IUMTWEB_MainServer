const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url-composer');

module.exports = (options) => {

    router.get('/', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "languages",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        try {
            const response = await axios.get(request_url);
            res.render('./languages/languages', {title: 'Languages', languages: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching languages.");
        }
    })


    router.get('/type', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "languages/type",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        try {
            const response = await axios.get(request_url);
            res.render('./languages/type', {title: 'Languages type', languages: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching languages.");
        }
    })

    router.get('/language', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "languages/language",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        try {
            const response = await axios.get(request_url);
            res.render('./languages/language', {title: 'Language', languages: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching languages.");
        }
    })

// nell'altro server è paginato
    router.get('/languages', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "languages/languages",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        try {
            const response = await axios.get(request_url);
            res.render('./languages/languages', {title: 'Languages', languages: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching languages.");
        }
    })

//mancano 2 route ------------


    router.get('/top10-languages', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "languages/top10-languages",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        try {
            const response = await axios.get(request_url);
            res.render('./languages/top10-languages', {title: 'top10 languages', languages: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching languages.");
        }
    })


    router.get('/top5-types', async (req, res, next) => {
        let request_url = url.build({
            host: options.servers.SQLBrokerHost,
            path: "languages/top5-types",
            query: {
                page: req.query.page,
                size: req.query.size,
            }
        });

        try {
            const response = await axios.get(request_url);
            res.render('./languages/top5-types', {title: 'top5 types', languages: response.data.content});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error fetching languages.");
        }
    })
    
    return router;

}




