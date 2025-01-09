const express = require('express');
const router = express.Router();
const axios = require('axios');
const { render_error } = require("../utils");

module.exports = (options) => {

    /**
     * Fetches all studios from the backend.
     * Renders a list of all studios.
     * @name GET /studios/all
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/all', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/studio');
            const studios = response.data.content;
            res.render('studios/all', { title: 'All Studios', studios });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches details of a specific studio by ID.
     * Renders the studio details page.
     * @name GET /studios/:id
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios.get(`http://localhost:8080/studio/${id}`);
            const studio = response.data;
            res.render('studios/details', { title: 'Studio Details', studio });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Searches for studios by a keyword.
     * Renders a list of studios matching the search keyword.
     * @name GET /studio/search
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/search', async (req, res) => {
        try {
            const { keyword } = req.query;
            const response = await axios.get('http://localhost:8080/studio/search', {
                params: { keyword: encodeURIComponent(keyword) },
            });
            const studios = response.data;
            res.render('studios/search', { title: `Studios Matching "${keyword}"`, studios });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches the total count of all studios.
     * Renders a page displaying the total count.
     * @name GET /studio/count
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/count', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/studio/count');
            const count = response.data;
            res.render('studios/count', { title: 'Studio Count', count });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches the top N studios by popularity.
     * Renders a list of the top N studios.
     * @name GET /studio/top
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/top', async (req, res) => {
        try {
            const { limit = 10 } = req.query;
            const response = await axios.get('http://localhost:8080/studio/top', {
                params: { limit },
            });
            const studios = response.data;
            res.render('studios/top', { title: 'Top Studios', studios });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches all studios ordered alphabetically.
     * Renders a list of studios in alphabetical order.
     * @name GET /studio/alphabetical
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/alphabetical', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:8080/studio/alphabetical');
            const studios = response.data;
            res.render('studios/alphabetical', { title: 'Studios Alphabetically Ordered', studios });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Handles unmatched routes and renders a 404 error page.
     * @name GET /*
     * @function
     * @memberof module:studios
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/*', function (req, res) {
        render_error(res, null, 404, "Page not found");
    });

    return router;
};