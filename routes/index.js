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
global.SQLBrokerHost = 'http://localhost:8080';

router.get('/statistics', function(req, res) {
  // Renderizza la pagina statistics
  res.render('statistics/statistics', { title: 'Statistics' });
});

router.get('/search', async (req, res) => {
  const query = req.query.query || ''; // Query digitata dall'utente
  if (!query) {
    return res.json([]); // Nessun risultato per query vuota
  }

  try {
    // Cerchiamo sia nei film che negli attori
    const [movies, actors] = await Promise.all([
      axios.get(`${global.SQLBrokerHost}/movies/name`, { params: { partial: query } }),
      axios.get(`${global.SQLBrokerHost}/actors/name`, { params: { partial: query } }),
    ]);

    // Formattiamo i risultati per la barra di ricerca
    const results = [
      ...movies.data.map(movie => ({ id: movie.id, name: movie.name, type: 'movie' })),
      ...actors.data.map(actor => ({ id: actor.id, name: actor.name, type: 'actor' })),
    ];

    res.json(results); // Restituiamo i risultati
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;