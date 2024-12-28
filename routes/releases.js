const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Route to fetch all releases.
 * @name GET/releases/all
 */
router.get('/all', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/releases');
        const releases = response.data.content;
        res.render('releases/all', { title: 'All Releases', releases });
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
        const { id } = req.params;
        const response = await axios.get(`http://localhost:8080/releases/${id}`);
        const release = response.data;
        res.render('releases/details', { title: 'Release Details', release });
    } catch (error) {
        console.error('Error fetching release details:', error.message);
        res.status(500).send('Error fetching release details.');
    }
});

module.exports = router;