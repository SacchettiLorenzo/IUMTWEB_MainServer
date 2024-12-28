const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Route to fetch all studios.
 * @name GET/studios/all
 */
router.get('/all', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/studio');
        const studios = response.data.content;
        res.render('studios/all', { title: 'All Studios', studios });
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
        const { id } = req.params;
        const response = await axios.get(`http://localhost:8080/studio/${id}`);
        const studio = response.data;
        res.render('studios/details', { title: 'Studio Details', studio });
    } catch (error) {
        console.error('Error fetching studio details:', error.message);
        res.status(500).send('Error fetching studio details.');
    }
});

module.exports = router;