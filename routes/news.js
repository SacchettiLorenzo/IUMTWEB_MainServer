const express = require('express');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();
const { render_error } = require("../utils");

const parser = new Parser();
const feedUrl = 'https://www.cinemablend.com/rss/topic/news/movies';

/**
 * Extracts the first image from an HTML page using a provided URL.
 * @async
 * @function extractFirstImage
 * @param {string} url - The URL of the HTML page.
 * @returns {Promise<string>} - The URL of the extracted image or a default image if not found.
 */
async function extractFirstImage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Attempts to find the first image with a specific class or attribute
        const image = $('img.block-image-ads.hero-image').attr('src') ||
            $('img.block-image-ads.hero-image').attr('data-original-mos');

        return image || '/public/images/default_news.png'; // Default image if none found
    } catch (error) {
        console.error(`Error fetching image from ${url}:`, error.message);
        return '/public/images/default-news.jpg'; // Default image in case of an error
    }
}

/**
 * Retrieves the latest movie news from an RSS feed, including image extraction.
 * Renders the news page or provides JSON data if requested via AJAX.
 * @name GET /
 * @function
 * @memberof module:news
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/', async (req, res) => {
    try {
        const feed = await parser.parseURL(feedUrl);

        // Maps news items and extracts their associated images
        const newsWithImages = await Promise.all(
            feed.items.map(async item => {
                const imageUrl = await extractFirstImage(item.link);
                return {
                    title: item.title,
                    link: item.link,
                    description: item.contentSnippet || item.description,
                    pubDate: new Date(item.pubDate).toLocaleDateString(),
                    imageUrl
                };
            })
        );

        // Handles AJAX requests or full page rendering
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(newsWithImages.slice(0, 5)); // Limits to the top 5 news items for the homepage
        }

        res.render('news/news', { title: 'Latest News', news: newsWithImages });
    } catch (error) {
        render_error(res, error, 500, "Internal Server Error");
    }
});

/**
 * Handles all unmatched routes and returns a 404 error page.
 * @name GET /*
 * @function
 * @memberof module:news
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/*', function (req, res, next) {
    render_error(res, null, 404, "Page not found");
});

module.exports = router;