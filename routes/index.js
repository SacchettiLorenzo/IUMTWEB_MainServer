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

const { getMoviesFromDatabase, getActorsFromDatabase, getNewsFromDatabase } = require('./movies');

const axios = require('axios');


router.get('/search', async (req, res) => {
  const query = req.query.query || ''; // Query digitata dall'utente
  const entity = req.query.entity || 'movies'; // Entità da cercare (default: movies)

  try {
    const response = await axios.get(`${global.SQLBrokerHost}/${entity}/name`, {
      params: { partial: query }
    });

    res.json(response.data); // Restituisci i risultati come JSON
  } catch (error) {
    console.error(`Error fetching data from ${entity}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;