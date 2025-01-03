const express = require('express');
const router = express.Router();
const axios = require('axios');

module.exports = (options) => {

    /**
     * Route to fetch all studios.
     * @name GET/studios/all
     */
    router.get('/all', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/studio');
            const studios = response.data.content;
            res.render('studios/all', {title: 'All Studios', studios});
        } catch (error) {
            console.error('Error fetching studios:', error.message);
            res.status(500).send('Error fetching studios.');
        }
    });

    /**
     * Route to fetch studio details by ID.
     * @name GET/studios/:id
     */
    router.get('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const response = await axios.get(`http://localhost:8080/studio/${id}`);
            const studio = response.data;
            res.render('studios/details', {title: 'Studio Details', studio});
        } catch (error) {
            console.error('Error fetching studio details:', error.message);
            res.status(500).send('Error fetching studio details.');
        }
    });
    /**
     * Route to search studios by keyword.
     * @name GET/studio/search
     */
    router.get('/search', async (req, res) => {
        try {
            const {keyword} = req.query;
            const response = await axios.get('http://localhost:8080/studio/search', {
                params: {keyword: encodeURIComponent(keyword)},
            });
            const studios = response.data;
            res.render('studios/search', {title: `Studios Matching "${keyword}"`, studios});
        } catch (error) {
            console.error('Error searching studios:', error.message);
            res.status(500).send('Error searching studios.');
        }
    });

    /**
     * Route to count all studios.
     * @name GET/studio/count
     */
    router.get('/count', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/studio/count');
            const count = response.data;
            res.render('studios/count', {title: 'Studio Count', count});
        } catch (error) {
            console.error('Error counting studios:', error.message);
            res.status(500).send('Error counting studios.');
        }
    });

    /**
     * Route to fetch the top N studios by ID.
     * @name GET/studio/top
     */
    router.get('/top', async (req, res) => {
        try {
            const {limit = 10} = req.query;
            const response = await axios.get('http://localhost:8080/studio/top', {
                params: {limit},
            });
            const studios = response.data;
            res.render('studios/top', {title: 'Top Studios', studios});
        } catch (error) {
            console.error('Error fetching top studios:', error.message);
            res.status(500).send('Error fetching top studios.');
        }
    });

    /**
     * Route to fetch studios ordered alphabetically.
     * @name GET/studio/alphabetical
     */
    router.get('/alphabetical', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/studio/alphabetical');
            const studios = response.data;
            res.render('studios/alphabetical', {title: 'Studios Alphabetically Ordered', studios});
        } catch (error) {
            console.error('Error fetching studios alphabetically:', error.message);
            res.status(500).send('Error fetching studios alphabetically.');
        }
    });

    return router;

}