var express = require('express');
var router = express.Router();
const axios = require('axios');
var url = require('url-composer');
const { render_error } = require("../utils");

module.exports = (options) => {

    /**
     * Fetches all countries from the backend.
     * Renders a list of all countries.
     * @name GET /countries/all
     * @function
     * @memberof module:countries
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/all', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/countries');
            const countries = response.data.content;
            res.render('countries/all', { title: 'All Countries', countries });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches a paginated and sorted list of countries.
     * Renders a paginated list of countries with sorting options.
     * @name GET /countries
     * @function
     * @memberof module:countries
     * @param {Object} req - Express request object containing pagination and sorting parameters.
     * @param {Object} res - Express response object.
     */
    router.get('/', async (req, res) => {
        try {
            const { page = 0, size = 20, sortParam = 'id', sortDirection = 'ASC' } = req.query;
            const response = await axios.get(`http://localhost:8080/countries`, {
                params: { page, size, sortParam, sortDirection }
            });
            const countries = response.data.content;
            res.render('countries/list', { title: 'Countries', countries });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Searches countries by name.
     * Renders a list of countries matching the search criteria.
     * @name GET /countries/name
     * @function
     * @memberof module:countries
     * @param {Object} req - Express request object containing the country name in the query.
     * @param {Object} res - Express response object.
     */
    router.get('/name', async (req, res) => {
        try {
            const { country } = req.query;
            const response = await axios.get(`http://localhost:8080/countries/name`, {
                params: { country }
            });
            const countries = response.data;
            res.render('countries/search', { title: `Search Results for ${country}`, countries });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches the top trending countries based on movie count.
     * Renders a list of the top 10 countries with the most movies.
     * @name GET /countries/top-countries
     * @function
     * @memberof module:countries
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/top-countries', function (req, res) {
        let topCountriesRequestUrl = url.build({
            host: options.servers.SQLBrokerHost,
            path: 'countries/trending'
        });

        axios.get(topCountriesRequestUrl).then(response => {
            const countries = response.data.map(countries => ({
                id: countries.id,
                country: countries.country,
                movie_count: countries.movie_count
            }));

            res.render('./countries/top-countries', {
                title: 'Top 10 Countries',
                type: 'country',
                countries: countries
            });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    });

    /**
     * Fetches country details by a specific ID.
     * Renders the details of the selected country.
     * @name GET /countries/:id
     * @function
     * @memberof module:countries
     * @param {Object} req - Express request object containing the country ID in the route parameters.
     * @param {Object} res - Express response object.
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios.get(`http://localhost:8080/countries/${id}`);
            const country = response.data;
            res.render('countries/details', { title: 'Country Details', country });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Handles unmatched routes and renders a 404 error page.
     * @name GET /*
     * @function
     * @memberof module:countries
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/*', function (req, res) {
        render_error(res, null, 404, "Page not found");
    });

    return router;
};