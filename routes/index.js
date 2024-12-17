var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET chat page for a specific movie. */
router.get('/chat/:movieName', function(req, res, next) {
  const movieName = req.params.movieName; // Ottieni il nome del film dalla URL
  res.render('chat', {
    title: `Chat for ${movieName}`, // Titolo dinamico
    roomName: movieName            // Passa il nome della stanza alla vista
  });
});

module.exports = router;