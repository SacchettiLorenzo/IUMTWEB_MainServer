// reviews.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const url = require('url-composer');
const { render_error } = require("../utils");

module.exports = (options) => {

    router.get('/', async (req, res) => {
        try {

            let request_url = url.build({
                host: 'http://localhost:3001',
                path: 'review'
            });

            const response = await axios.get(request_url);

            res.render('reviews/overview', {
                title: 'Reviews Overview',
                overview: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    router.get('/all', async (req, res) => {
        try {
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: 'review/all'
            });

            const response = await axios.get(request_url);

            res.render('reviews/all', {
                title: 'All Reviews',
                reviews: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });


    router.get('/movie/:title', async (req, res) => {
        try {
            const { title } = req.params;

            let request_url = url.build({
                host: 'http://localhost:3001',
                path: `review/movie/${title}`
            });

            const response = await axios.get(request_url);

            // response.data conterrà, presumibilmente, l'oggetto del film + reviews
            res.render('reviews/single_movie', {
                title: `Reviews for ${title}`,
                movieData: response.data  // qui avrai { movie_title, reviews: [...] }
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    router.get('/publisher/:publisher', async (req, res) => {
        try {
            const { publisher } = req.params;
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: `review/publisher/${publisher}`
            });

            const response = await axios.get(request_url);

            res.render('reviews/publisher', {
                title: `Reviews by publisher: ${publisher}`,
                reviews: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });


    router.get('/top_critic/:status', async (req, res) => {
        try {
            const { status } = req.params;
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: `review/top_critic/${status}`
            });

            const response = await axios.get(request_url);

            res.render('reviews/top_critic', {
                title: `Top critic = ${status}`,
                reviews: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

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


    router.get('/movies/top-10-reviewed', async (req, res) => {
        try {
            let request_url = url.build({
                host: 'http://localhost:3001',
                path: 'review/movies/top-10-reviewed'
            });

            const response = await axios.get(request_url);

            res.render('reviews/top_reviewed_movies', {
                title: 'Top 10 Movies by Distinct Critics',
                movies: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });


    router.get('/*', function (req, res) {
        render_error(res, null, 404, "Page not found");
    });

    return router;
};
