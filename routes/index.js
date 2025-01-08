var express = require('express');
var router = express.Router();
const axios = require('axios');
global.SQLBrokerHost = 'http://localhost:8080';
var url = require('url-composer');
const {render_error} = require("../utils");

module.exports = (options) => {

  router.get('/', async function (req, res) {
      // URL per i film
      const random_page = Math.floor(Math.random() * 500);
      const moviesRequestUrl = options.servers.SQLBrokerHost + 'movies?size=20&page='+random_page+'&sortParam=id&sortDirection=asc';

      // URL per gli attori
      const actorsRequestUrl = url.build({
        host: options.servers.SQLBrokerHost,
        path: 'actors/top10-mostPopularActors'
      });

      const UpcomingRequestUrl = url.build({
        host: options.servers.SQLBrokerHost,
        path: 'movies/date',
        query: {
          date: 2025, // Passa l'anno come parametro
        },
      });

      Promise.all([
        axios.get(moviesRequestUrl).then(movies =>{
          return movies
        }),
        axios.get(actorsRequestUrl).then(actors =>{
          return actors
        }),
        axios.get(UpcomingRequestUrl).then(upcoming =>{
          return upcoming
        })
      ]).then(results => {
        res.render('index', {
          title : "Home",
          movies: results[0].data.content.sort(() => 0.5 - Math.random()).slice(0, 10),
          actors: JSON.stringify(results[1].data),
          upcoming_movies : results[2].data.slice(0, 10)
        })
      }).catch(error => {
        render_error(res,error,500,"Internal Server Error");
      })

  });

  router.get('/upcoming-movies', async (req, res) => {
    try {
      // Costruisce l'URL per richiedere i film dal 2025 in poi
      const requestUrl = url.build({
        host: options.servers.SQLBrokerHost,
        path: 'movies/date',
        query: {
          date: 2025, // Passa l'anno come parametro
        },
      });

      console.log('Request URL:', requestUrl); // Debug dell'URL

      // Effettua la richiesta al server SQL
      const response = await axios.get(requestUrl);

      // I film sono già filtrati dal backend, non c'è bisogno di ulteriore filtraggio
      const movies = response.data;
      console.log(movies);

      // Renderizza la sezione "Prossime Uscite"
      res.render('homepage/upcoming_movies', {
        title: 'Prossime Uscite',
        upcoming_movies: movies.slice(0, 10), // Mostra i primi 10 film
      });
    } catch (error) {
      console.error('Error fetching upcoming movies:', error.message);
      res.status(500).send('Errore nel caricamento delle prossime uscite.');
    }
  });

  router.get('/popular-movies', async (req, res) => {
    try {
      const requestUrl = options.servers.SQLBrokerHost + 'movies/popular?startYear=2001&endYear=2024&minRating=4.0&limit=50';

      // Chiamata al backend per ottenere i film filtrati
      const response = await axios.get(requestUrl);
      const movies = response.data;

      // Filtra i film ricevuti (se necessario)
      const filteredMovies = movies.filter(movie => {
        const year = movie.date; // Poiché `date` è già un numero
        return year >= 2001 && year <= 2024 && movie.rating > 4.0;
      });

      if (!filteredMovies || filteredMovies.length === 0) {
        console.error("No movies match the filtering criteria.");
        return res.json([]); // Nessun film trovato
      }

      // Mappiamo i dati per il grafico
      const movieData = filteredMovies.map(movie => ({
        name: movie.name,
        poster: movie.poster,
        description: movie.description || "No description available.",
        rating: movie.rating,
        year: movie.date, // Poiché `date` è già un numero
      }));

      res.json(movieData);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/popular-actors', async (req, res) => {
    let topActorsRequestUrl = url.build({
      host: options.servers.SQLBrokerHost,
      path: 'actors/top10-mostPopularActors'
    });

    try {
      const response = await axios.get(topActorsRequestUrl);
      console.log('Dati attori ricevuti per /popular-actors:', response.data);

      return res.render('homepage/popular_actors', {
        title: 'Popular Actors',
        actors: response.data
      });
    } catch (error) {
      console.error('Errore nel recupero degli attori popolari:', error);
      return res.status(500).send('Internal Server Error');
    }
  });


  /* GET channels page. */
  router.get('/channels', function (req, res) {
    res.render('channels/channels', {title: 'Channels'});
  });

  router.get('/chat', async (req, res) => {
    const {topic, movieTitle, actorName} = req.query;

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
      const response = await axios.get(`${options.servers.SQLBrokerHost}${endpoint}/name`, {
        params: {partial: query}
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

}