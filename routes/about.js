const express = require('express');
const router = express.Router();

// Route for the About page
router.get('/', (req, res) => {
    res.render('about/about', {
        title: 'About Us - CineReviews',
        header: 'CineReviews',
    });
});

module.exports = router;