var express = require('express');
var router = express.Router();
const axios = require('axios');
global.SQLBrokerHost = 'http://localhost:8080';
var url = require('url-composer');
const { render_error } = require("../utils");

module.exports = (options) => {

  /**
   * Renders the home page with data for movies, actors, upcoming movies, and reviews.
   * Fetches data from multiple endpoints asynchronously.
   * @name GET /
   * @function
   * @memberof module:index
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  router.get('/', async function (req, res) {
    const random_page = Math.floor(Math.random() * 500);
    const moviesRequestUrl = options.servers.SQLBrokerHost + 'movies?size=20&page=' + random_page + '&sortParam=id&sortDirection=asc';

    const actorsRequestUrl = url.build({
      host: options.servers.SQLBrokerHost,
      path: 'actors/top10-mostPopularActors'
    });

    const upcomingRequestUrl = url.build({
      host: options.servers.SQLBrokerHost,
      path: 'movies/date',
      query: { date: 2025 },
    });

    const reviewsRequestUrl = url.build({
      host: options.servers.NoSQLBrokerHost,
      path: 'review/last_review'
    });

    Promise.all([
      axios.get(moviesRequestUrl),
      axios.get(actorsRequestUrl),
      axios.get(upcomingRequestUrl),
      axios.get(reviewsRequestUrl),
    ])
        .then(([movies, actors, upcoming, reviews]) => {
          res.render('index', {
            title: 'Home',
            movies: movies.data.content.sort(() => 0.5 - Math.random()).slice(0, 10),
            actors: JSON.stringify(actors.data),
            upcoming_movies: upcoming.data.slice(0, 10),
            reviews: reviews.data.map(r => r.reviews),
          });
        })
        .catch(error => {
          render_error(res, error, 500, "Internal Server Error");
        });
  });

  /**
   * Renders a page with upcoming movie releases.
   * @name GET /upcoming-movies
   * @function
   * @memberof module:index
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  router.get('/upcoming-movies', async (req, res) => {
    try {
      const requestUrl = url.build({
        host: options.servers.SQLBrokerHost,
        path: 'movies/date',
        query: { date: 2025 },
      });

      const response = await axios.get(requestUrl);

      res.render('homepage/upcoming_movies', {
        title: 'Upcoming Movies',
        upcoming_movies: response.data.slice(0, 10),
      });
    } catch (error) {
      render_error(res, error, 500, "Internal Server Error");
    }
  });

  /**
   * Provides popular movie data as JSON.
   * @name GET /popular-movies
   * @function
   * @memberof module:index
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  router.get('/popular-movies', async (req, res) => {
    try {
      const requestUrl = options.servers.SQLBrokerHost + 'movies/popular?startYear=2001&endYear=2024&minRating=4.0&limit=50';
      const response = await axios.get(requestUrl);

      res.json(
          response.data.map(movie => ({
            name: movie.name,
            poster: movie.poster,
            description: movie.description || "No description available.",
            rating: movie.rating,
            year: movie.date,
          }))
      );
    } catch (error) {
      render_error(res, error, 500, "Internal Server Error");
    }
  });

  /**
   * Renders a page with the top 10 popular actors.
   * @name GET /popular-actors
   * @function
   * @memberof module:index
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  router.get('/popular-actors', async (req, res) => {
    try {
      const topActorsRequestUrl = url.build({
        host: options.servers.SQLBrokerHost,
        path: 'actors/top10-mostPopularActors'
      });

      const response = await axios.get(topActorsRequestUrl);

      res.render('homepage/popular_actors', {
        title: 'Popular Actors',
        actors: response.data
      });
    } catch (error) {
      render_error(res, error, 500, "Internal Server Error");
    }
  });

  /**
   * Renders the channels page.
   * @name GET /channels
   * @function
   * @memberof module:index
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  router.get('/channels', function (req, res) {
    try {
      res.render('channels/channels', { title: 'Channels' });
    } catch (error) {
      render_error(res, error, 500, "Internal Server Error");
    }
  });

  /**
   * Renders a chat page for movies or actors.
   * @name GET /chat
   * @function
   * @memberof module:index
   * @param {Object} req - Express request object containing query parameters.
   * @param {Object} res - Express response object.
   */
  router.get('/chat', async (req, res) => {
    const { topic, movieTitle, actorName } = req.query;

    try {
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
        render_error(res, null, 400, "Topic, Movie Title, or Actor Name is required.");
        return;
      }

      const response = await axios.get(`${options.servers.SQLBrokerHost}${endpoint}/name`, {
        params: { partial: query }
      });

      if (!response.data || response.data.length === 0) {
        render_error(res, null, 404, `No matching ${endpoint} found.`);
        return;
      }

      roomName = `${roomName}-${query.replace(/\s+/g, '_')}`;
      res.render('chat', {
        title: `Chat Room: ${roomName}`,
        roomName,
        topic,
        movieTitle: endpoint === 'movies' ? query : null,
        actorName: endpoint === 'actors' ? query : null,
      });
    } catch (error) {
      render_error(res, error, 500, "Internal Server Error");
    }
  });

  const {getMoviesFromDatabase, getActorsFromDatabase, getNewsFromDatabase} = require('./movies');
  //const {options} = require("axios");

  router.get('/statistics', function (req, res) {
    // Renderizza la pagina statistics
    res.render('statistics/statistics', {title: 'Statistics'});
  });

  router.get('/search', async (req, res) => {
    const query = req.query.query || ''; // Query digitata dall'utente
    if (!query) {
      return res.json([]); // Nessun risultato per query vuota
    }

    try {
      // Cerchiamo sia nei film che negli attori
      const [movies, actors] = await Promise.all([
        axios.get(`${options.servers.SQLBrokerHost}movies/name`, {params: {partial: query}}),
        axios.get(`${options.servers.SQLBrokerHost}actors/name`, {params: {partial: query}}),
      ]);

      // Formattiamo i risultati per la barra di ricerca
      const results = [
        ...movies.data.map(movie => ({id: movie.id, name: movie.name, type: 'movie'})),
        ...actors.data.map(actor => ({id: actor.id, name: actor.name, type: 'actor'})),
      ];

      res.json(results); // Restituiamo i risultati
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/popular-countries', async (req, res) => {
    try {
      const requestUrl = `${global.SQLBrokerHost}/countries/trending`;

      const response = await axios.get(requestUrl);
      const countries = response.data;

      if (!countries || countries.length === 0) {
        console.error("No countries found.");
        return res.json([]);
      }

      const countryData = countries.map(country => ({
        name: country.country,
        movieCount: country.movie_count,
      }));

      res.json(countryData);
    } catch (error) {
      console.error('Error fetching top countries:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/popular-genres', async (req, res) => {
    try {
      const requestUrl = `${global.SQLBrokerHost}/genres/trending`;
      const response = await axios.get(requestUrl);
      const genres = response.data;

      if (!genres || genres.length === 0) {
        console.error("No genres found.");
        return res.json([]);
      }

      const genreData = genres.map(genre => ({
        genre: genre.genre,
        movieCount: genre.movie_count,
      }));

      res.json(genreData);
    } catch (error) {
      console.error('Error fetching popular genres:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};