const express = require('express');
const router = express.Router();
const axios = require('axios');
const { render_error } = require("../utils");

module.exports = (options) => {

    /**
     * Fetches all releases from the backend.
     * Renders a list of all releases with pagination and sorting options.
     * @name GET /releases/all
     * @function
     * @memberof module:releases
     * @param {Object} req - Express request object containing query parameters for pagination and sorting.
     * @param {Object} res - Express response object.
     */
    router.get('/all', async (req, res) => {
        try {
            const { page = 0, size = 20, sortParam = 'id', sortDirection = 'ASC' } = req.query;
            const response = await axios.get('http://localhost:8080/releases', {
                params: { page, size, sortParam, sortDirection }
            });
            const releases = response.data.content;
            res.render('releases/all', { title: 'All Releases', releases });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches release details by a specific ID.
     * Renders a page displaying the details of the selected release.
     * @name GET /releases/:id
     * @function
     * @memberof module:releases
     * @param {Object} req - Express request object containing the release ID in the route parameters.
     * @param {Object} res - Express response object.
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios.get(`http://localhost:8080/releases/${id}`);
            const release = response.data;
            res.render('releases/details', { title: 'Release Details', release });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches releases based on the country.
     * Renders a page displaying releases filtered by the specified country.
     * @name GET /releases/country
     * @function
     * @memberof module:releases
     * @param {Object} req - Express request object containing the country in the query parameters.
     * @param {Object} res - Express response object.
     */
    router.get('/country', async (req, res) => {
        try {
            const { country } = req.query;
            const response = await axios.get('http://localhost:8080/releases/country', {
                params: { country }
            });
            const releases = response.data;
            res.render('releases/country', { title: `Releases in ${country}`, releases });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches releases by type and country.
     * Renders a page displaying releases filtered by the specified type and country.
     * @name GET /releases/type
     * @function
     * @memberof module:releases
     * @param {Object} req - Express request object containing type and country in the query parameters.
     * @param {Object} res - Express response object.
     */
    router.get('/type', async (req, res) => {
        try {
            const { type, country } = req.query;
            const response = await axios.get('http://localhost:8080/releases/type', {
                params: { type, country }
            });
            const releases = response.data;
            res.render('releases/type', { title: `Releases (${type}) in ${country}`, releases });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches releases based on a specific rating.
     * Renders a page displaying releases filtered by the specified rating.
     * @name GET /releases/rating
     * @function
     * @memberof module:releases
     * @param {Object} req - Express request object containing the rating in the query parameters.
     * @param {Object} res - Express response object.
     */
    router.get('/rating', async (req, res) => {
        try {
            const { rating } = req.query;
            const response = await axios.get('http://localhost:8080/releases/rating', {
                params: { rating }
            });
            const releases = response.data;
            res.render('releases/rating', { title: `Releases with Rating ${rating}`, releases });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Handles unmatched routes and renders a 404 error page.
     * @name GET /*
     * @function
     * @memberof module:releases
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/*', function (req, res) {
        render_error(res, null, 404, "Page not found");
    });

    return router;
};