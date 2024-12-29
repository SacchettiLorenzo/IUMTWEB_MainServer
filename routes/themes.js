const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url-composer');



router.get('/', async  (req, res, next) =>{
    let request_url = url.build({
        host: global.SQLBrokerHost,
        path: "themes",
        query: {
            page: req.query.page,
            size: req.query.size,
        }
    });

    try {
        const response = await axios.get(request_url);
        res.render('./themes/themes', {title: 'Themes', themes: response.data.content});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching themes.");
    }
})

router.get('/id', async  (req, res, next) =>{
    let themes_data_request_url = url.build({
        host: global.SQLBrokerHost,
        path: "themes/id",
        query: {
            id: req.query.id,
        }
    })

    try {
        const response = await axios.get(themes_data_request_url);
        res.render('./themes/single_theme', { title: 'Theme Details', theme: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching theme.");
    }
})


router.get('/top10', async (req, res, next) =>{
    let themes_data_request_url = url.build({
        host: global.SQLBrokerHost,
        path: "themes/id",
        query: {
            id: req.query.id,
        }
    })

    try{
        const response = await axios.get(themes_data_request_url);
        res.render('./themes/top10', {title: 'Top 10 Themes', theme: response.data });
    }catch(error){
        console.error(error);
        res.status(500).send("Error retrieving top 10 themes.");
    }
})

module.exports = router;