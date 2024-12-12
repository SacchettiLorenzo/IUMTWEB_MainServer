var express = require('express');
var router = express.Router();

var movies = [
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    },
    {
        "movie_name": "Oppenheimer",
        "movie_date": 2023,
        "movie_poster" : "https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-230-0-345-crop.jpg?v=e3c6e7a32c",
        "movie_description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II"
    }
]

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('movies', { title: 'Movies', movies : movies });

});

module.exports = router;
