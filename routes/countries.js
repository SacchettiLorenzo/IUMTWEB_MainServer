var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const {log} = require("debug");
var async = require('async')
const res = require("express/lib/response");

module.exports = (options) => {


    /**
     * Route to fetch all countries.
     * @name GET/countries/all
     */
    router.get('/all', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/countries');
            const countries = response.data.content;
            res.render('countries/all', {title: 'All Countries', countries});
        } catch (error) {
            console.error('Error fetching countries:', error.message);
            res.status(500).send('Error fetching countries.');
        }
    })

    /**
     * Route to fetch paginated and sorted list of countries.
     * @name GET /countries
     */
    router.get('/', async (req, res) => {
        try {
            const {page = 0, size = 20, sortParam = 'id', sortDirection = 'ASC'} = req.query;
            const response = await axios.get(`http://localhost:8080/countries`, {
                params: {page, size, sortParam, sortDirection}
            });
            const countries = response.data.content;
            res.render('countries/list', {title: 'Countries', countries});
        } catch (error) {
            console.error('Error fetching countries:', error.message);
            res.status(500).send('Error fetching countries.');
        }
    })


    /**
     * Route to fetch trending countries.
     * @name GET /countries/trending
     */
    /*
    router.get('/trending', async (req, res) => {
        try {
            const {page = 0, size = 10} = req.query;
            const response = await axios.get(`http://localhost:8080/countries/trending`, {
                params: {page, size}
            });
            const countries = response.data.content;
            res.render('countries/trending', {title: 'Trending Countries', countries});
        } catch (error) {
            console.error('Error fetching trending countries:', error.message);
            res.status(500).send('Error fetching trending countries.');
        }
    });
     */

    /**
     * Route to search countries by name.
     * @name GET /countries/name
     */
    router.get('/name', async (req, res) => {
        try {
            const {country} = req.query;
            const response = await axios.get(`http://localhost:8080/countries/name`, {
                params: {country}
            });
            const countries = response.data;
            res.render('countries/search', {title: `Search Results for ${country}`, countries});
        } catch (error) {
            console.error('Error searching for countries:', error.message);
            res.status(500).send('Error searching for countries.');
        }
    })

    router.get('/top-countries', function (req, res, next) {
        let topCountriesRequestUrl = url.build({
            host: options.servers.SQLBrokerHost,
            path: 'countries/trending'
        });

        axios.get(topCountriesRequestUrl).then(response => {
            const countries = response.data.map(countries => ({
                id: countries.id,  // Assicurati che l'ID sia presente
                country: countries.country,
                movie_count: countries.movie_count
            }));

            res.render('./countries/top-countries', {
                title: 'Top 10 Countries',
                type: 'country',
                countries: countries
            });
        }).catch(error => {
            console.error("Error fetching top countries:", error);
            res.status(500).send("Error fetching top countries");
        });
    })

    /**
     * Route to fetch country details by ID.
     * @name GET/countries/:id
     */
    router.get('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const response = await axios.get(`http://localhost:8080/countries/${id}`);
            const country = response.data;
            res.render('countries/details', {title: 'Country Details', country});
        } catch (error) {
            console.error('Error fetching country details:', error.message);
            res.status(500).send('Error fetching country details.');
        }
    })



    return router;

}


/*
HTTP Method	    Path	Spring Controller   Method	                Descrizione
GET	            /countries	                findAll	                Ottenere paesi paginati e ordinati
GET	            /countries/trending	        getTopCountries	        Ottenere paesi trending
GET	            /countries/name	            getCountriesByName	    Cercare paesi per nome
GET	            /countries/:id	            getCountryById	        Ottenere dettagli di un paese per ID
*/