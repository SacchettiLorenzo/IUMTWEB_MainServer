const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Route to fetch all countries.
 * @name GET/countries/all
 */
router.get('/all', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/countries');
        const countries = response.data.content;
        res.render('countries/all', { title: 'All Countries', countries });
    } catch (error) {
        console.error('Error fetching countries:', error.message);
        res.status(500).send('Error fetching countries.');
    }
});

/**
 * Route to fetch country details by ID.
 * @name GET/countries/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`http://localhost:8080/countries/${id}`);
        const country = response.data;
        res.render('countries/details', { title: 'Country Details', country });
    } catch (error) {
        console.error('Error fetching country details:', error.message);
        res.status(500).send('Error fetching country details.');
    }
});

module.exports = router;