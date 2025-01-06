var express = require('express');
var router = express.Router();
const axios = require('axios');
global.SQLBrokerHost = 'http://localhost:8080';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

/* GET channels page. */
router.get('/channels', function(req, res) {
  res.render('channels/channels', { title: 'Channels' });
});

router.get('/chat', async (req, res) => {
  const { topic, movieTitle, actorName } = req.query;

  let roomName = topic;
  let query = '';
  let endpoint = '';

  if (topic === 'movies' && movieTitle) {
    query = movieTitle;
    endpoint = 'movies';
  } else if (topic === 'actors' && actorName) {
    query = actorName;
    endpoint = 'actors';
  }

  if (!query) {
    return res.status(400).send('Topic, Movie Title, or Actor Name is required.');
  }

  try {
    const response = await axios.get(`${global.SQLBrokerHost}/${endpoint}/name`, {
      params: { partial: query }
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).send(`No matching ${endpoint} found.`);
    }

    roomName = `${roomName}-${query.replace(/\s+/g, '_')}`;
    res.render('chat', {
      title: `Chat Room: ${roomName}`,
      roomName: roomName,
      topic: topic,
      movieTitle: endpoint === 'movies' ? query : null,
      actorName: endpoint === 'actors' ? query : null,
    });
  } catch (error) {
    console.error('Error validating entity:', error);
    res.status(500).send('Internal Server Error');
  }
});

const { getMoviesFromDatabase, getActorsFromDatabase, getNewsFromDatabase } = require('./movies');


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