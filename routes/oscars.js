var express = require('express');
var router = express.Router();
const axios = require('axios');
const url = require('url-composer');
const { render_error } = require("../utils");

module.exports = (options) => {

    /**
     * Fetches a list of all Oscars.
     * Renders a page displaying all Oscars.
     * @name GET /oscars
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/', function (req, res) {
        let request_url = url.build({
            host: 'http://localhost:3001',
            path: 'oscar/all',
        });

        axios.get(request_url).then(response => {
            res.render('./oscars/oscars', { title: 'All Oscars', oscars: response.data });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    });

    /**
     * Fetches details of a single Oscar by ID.
     * Renders a page displaying Oscar details.
     * @name GET /oscars/:id
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object containing Oscar ID in params.
     * @param {Object} res - Express response object.
     */
    router.get('/:id', function (req, res) {
        let request_url = url.build({
            host: 'http://localhost:3001',
            path: `oscar/id/${req.params.id}`,
        });

        axios.get(request_url).then(response => {
            res.render('./oscars/single_oscar', { title: 'Oscar Details', oscar: response.data });
        }).catch(error => {
            render_error(res, error, 500, "Internal Server Error");
        });
    });

    /**
     * Fetches the top N films with the most Oscars.
     * Renders a page displaying the top films.
     * @name GET /oscars/top/:limit
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object containing the limit in params.
     * @param {Object} res - Express response object.
     */
    router.get('/top/:limit', async function (req, res) {
        try {
            const { limit } = req.params;
            const request_url = `http://localhost:3001/oscar/top/${limit}`;
            const response = await axios.get(request_url);

            res.render('oscars/top', {
                title: `Top ${limit} Films with Most Oscars`,
                topFilms: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches Oscars for a specific year.
     * Renders a page displaying Oscars by year.
     * @name GET /oscars/year/:year
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object containing the year in params.
     * @param {Object} res - Express response object.
     */
    router.get('/year/:year', async function (req, res) {
        try {
            const { year } = req.params;
            const request_url = `http://localhost:3001/oscar/year_film/${year}`;
            const response = await axios.get(request_url);

            res.render('oscars/year', {
                title: `Oscars for Year: ${year}`,
                oscarsByYear: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches Oscars by category.
     * Renders a page displaying Oscars by category.
     * @name GET /oscars/category/:category
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object containing the category in params.
     * @param {Object} res - Express response object.
     */
    router.get('/category/:category', async function (req, res) {
        try {
            const { category } = req.params;
            const request_url = `http://localhost:3001/oscar/category/${category}`;
            const response = await axios.get(request_url);

            res.render('oscars/category', {
                title: `Oscars in Category: ${category}`,
                oscarsByCategory: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches Oscars for a specific film by title.
     * Renders a page displaying Oscars for the selected film.
     * @name GET /oscars/film/:title
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object containing the film title in params.
     * @param {Object} res - Express response object.
     */
    router.get('/film/:title', async function (req, res) {
        try {
            const { title } = req.params;
            const request_url = `http://localhost:3001/oscar/film/${title}`;
            const response = await axios.get(request_url);

            res.render('oscars/single_movie_oscars', {
                movie_title: ` ${title}`,
                oscarsByFilm: response.data[0]
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches all Oscars.
     * Renders a page displaying all Oscars.
     * @name GET /oscars/all
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/all', async function (req, res) {
        try {
            const request_url = 'http://localhost:3001/oscar/all';
            const response = await axios.get(request_url);

            res.render('oscars/all', {
                title: 'All Oscars',
                oscars: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Fetches the top N nominated films.
     * Renders a page displaying the top nominated films.
     * @name GET /oscars/nominations/top/:limit
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object containing the limit in params.
     * @param {Object} res - Express response object.
     */
    router.get('/nominations/top/:limit', async function (req, res) {
        try {
            const { limit } = req.params;
            const request_url = `http://localhost:3001/oscar/nominations/top/${limit}`;
            const response = await axios.get(request_url);

            res.render('oscars/nominations_top', {
                title: `Top ${limit} Films with Most Nominations`,
                topNominatedFilms: response.data
            });
        } catch (error) {
            render_error(res, error, 500, "Internal Server Error");
        }
    });

    /**
     * Handles unmatched routes and renders a 404 error page.
     * @name GET /*
     * @function
     * @memberof module:oscars
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    router.get('/*', function (req, res) {
        render_error(res, null, 404, "Page not found");
    });

    return router;
};