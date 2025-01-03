const express = require('express');
const router = express.Router();
const axios = require('axios');

module.exports = (options) => {

    /**
     * Route to fetch all releases.
     * @name GET/releases/all
     */
    router.get('/all', async (req, res) => {

        try {
            const {page = 0, size = 20, sortParam = 'id', sortDirection = 'ASC'} = req.query;
            const response = await axios.get('http://localhost:8080/releases', {
                params: {page, size, sortParam, sortDirection}
            });
            const releases = response.data.content;
            res.render('releases/all', {title: 'All Releases', releases});
        } catch (error) {
            console.error('Error fetching releases:', error.message);
            res.status(500).send('Error fetching releases.');
        }
    });

    /**
     * Route to fetch release details by ID.
     * @name GET/releases/:id
     */
    router.get('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const response = await axios.get(`http://localhost:8080/releases/${id}`);
            const release = response.data;
            res.render('releases/details', {title: 'Release Details', release});
        } catch (error) {
            console.error('Error fetching release details:', error.message);
            res.status(500).send('Error fetching release details.');
        }
    });


    router.get('/country', async (req, res) => {
        try {
            const {country} = req.query;
            const response = await axios.get('http://localhost:8080/releases/country', {
                params: {country}
            });
            const releases = response.data;
            res.render('releases/country', {title: `Releases in ${country}`, releases});
        } catch (error) {
            console.error('Error fetching releases by country:', error.message);
            res.status(500).send('Error fetching releases by country.');
        }
    });

    router.get('/type', async (req, res) => {
        try {
            const {type, country} = req.query;
            const response = await axios.get('http://localhost:8080/releases/type', {
                params: {type, country}
            });
            const releases = response.data;
            res.render('releases/type', {title: `Releases (${type}) in ${country}`, releases});
        } catch (error) {
            console.error('Error fetching releases by type and country:', error.message);
            res.status(500).send('Error fetching releases by type and country.');
        }
    });


    router.get('/rating', async (req, res) => {
        try {
            const {rating} = req.query;
            const response = await axios.get('http://localhost:8080/releases/rating', {
                params: {rating}
            });
            const releases = response.data;
            res.render('releases/rating', {title: `Releases with Rating ${rating}`, releases});
        } catch (error) {
            console.error('Error fetching releases by rating:', error.message);
            res.status(500).send('Error fetching releases by rating.');
        }
    });

    return router;

}