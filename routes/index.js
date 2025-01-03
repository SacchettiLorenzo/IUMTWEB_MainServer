var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

/* GET channels page. */
router.get('/channels', function(req, res) {
  res.render('channels/channels', { title: 'Channels' });
});

/* GET chat page for a specific topic or movie/actor */
router.get('/chat', function(req, res) {
  const { topic, movieTitle, actorName } = req.query;

  let roomName = topic; // Base della stanza
  if (topic === 'movies' && movieTitle) {
    roomName = `${roomName}-${movieTitle.replace(/\s+/g, '_')}`;
  } else if (topic === 'actors' && actorName) {
    roomName = `${roomName}-${actorName.replace(/\s+/g, '_')}`;
  }

  if (!roomName) {
    return res.status(400).send('Topic, Movie Title, or Actor Name is required');
  }

  res.render('chat', {
    title: `Chat Room: ${roomName}`,
    roomName: roomName,
    topic: topic,
    movieTitle: movieTitle,
    actorName: actorName,
  });
});

module.exports = router;