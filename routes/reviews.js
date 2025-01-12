const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url-composer');
const { render_error } = require("../utils");

module.exports = (options) => {

    /**
     * Retrieves the last 10 reviews (sorted by review_date).
     * @name GET /reviews/last_review
     * @function
     * @memberof module:reviews
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     */
    router.get('/last_review', async (req, res) => {
        try {
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: 'review/last_review'
            });

            const response = await axios.get(request_url);

            res.render('reviews/last_review', {
                title: 'Last 10 reviews',
                reviews: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Retrieves the top 10 critics with the highest number of reviews.
     * @name GET /reviews/critics/top-10
     * @function
     * @memberof module:reviews
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     */
    router.get('/critics/top-10', async (req, res) => {
        try {
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: 'review/critics/top-10'
            });

            const response = await axios.get(request_url);

            res.render('reviews/top_critics', {
                title: 'Top 10 Critics',
                critics: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Retrieves the top 10 movies sorted by the number of distinct critics.
     * @name GET /reviews/movies/top-10-reviewed
     * @function
     * @memberof module:reviews
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     */
    router.get('/movies/top-10-reviewed', async (req, res) => {
        try {
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: 'review/movies/top-10-reviewed'
            });

            const response = await axios.get(request_url);

            res.render('reviews/top_reviewed_movies', {
                title: 'Top 10 most critically acclaimed films',
                movies: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });


    return router;
};
