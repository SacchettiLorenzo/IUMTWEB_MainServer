const express = require('express');
const router = express.Router();
const { render_error } = require("../utils");

/**
 * Renders the "About Us" page.
 * Provides information about the CineReviews platform.
 * @name GET /about
 * @function
 * @memberof module:about
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/', (req, res) => {
    try {
        res.render('about/about', {
            title: 'About Us - CineReviews',
            header: 'CineReviews',
        });
    } catch (error) {
        render_error(res, error, 500, "Internal Server Error");
    }
});

/**
 * Handles unmatched routes within the /about namespace.
 * Renders a 404 error page.
 * @name GET /*
 * @function
 * @memberof module:about
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/*', function (req, res) {
    render_error(res, null, 404, "Page not found");
});

module.exports = router;