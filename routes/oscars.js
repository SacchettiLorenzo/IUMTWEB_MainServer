var express = require('express');
var router = express.Router();
const axios = require('axios');
const url = require('url-composer');

module.exports = (options) => {

    /* GET all Oscars */
    router.get('/', function (req, res, next) {
        let request_url = url.build({
            host: 'http://localhost:3001',
            path: 'oscar/all',
        });

        axios.get(request_url).then(response => {
            res.render('./oscars/oscars', {title: 'All Oscars', oscars: response.data});
        }).catch(error => {
            console.error('Error fetching all Oscars:', error);
            res.status(500).send('Error fetching all Oscars.');
        });
    });

    //todo: delete this route because we do not have link with NOSQL movies and SQL id
    /* GET details of a single Oscar */
    router.get('/:id', function (req, res, next) {
        let request_url = url.build({
            host: 'http://localhost:3001',
            path: `oscar/id/${req.params.id}`,
        });

        axios.get(request_url).then(response => {
            res.render('./oscars/single_oscar', {title: 'Oscar Details', oscar: response.data});
        }).catch(error => {
            console.error('Error fetching Oscar details:', error);
            res.status(500).send('Error fetching Oscar details.');
        });
    });

    router.get('/top/:limit', async function (req, res, next) {
        try {
            const {limit} = req.params;
            const request_url = `http://localhost:3001/oscar/top/${limit}`;
            const response = await axios.get(request_url);
            const topFilms = response.data;

            res.render('oscars/top', {
                title: `Top ${limit} Films with Most Oscars`,
                topFilms
            });
        } catch (error) {
            console.error('Error fetching top films:', error);
            res.status(500).send('Error fetching top films.');
        }
    });

    router.get('/year/:year', async function (req, res, next) {
        try {
            const {year} = req.params;
            const request_url = `http://localhost:3001/oscar/year_film/${year}`;
            const response = await axios.get(request_url);
            const oscarsByYear = response.data;

            res.render('oscars/year', {
                title: `Oscars for Year: ${year}`,
                oscarsByYear
            });
        } catch (error) {
            console.error('Error fetching Oscars by year:', error);
            res.status(500).send('Error fetching Oscars by year.');
        }
    });

    router.get('/category/:category', async function (req, res, next) {
        try {
            const {category} = req.params;
            const request_url = `http://localhost:3001/oscar/category/${category}`;
            const response = await axios.get(request_url);
            const oscarsByCategory = response.data;

            res.render('oscars/category', {
                title: `Oscars in Category: ${category}`,
                oscarsByCategory
            });
        } catch (error) {
            console.error('Error fetching Oscars by category:', error);
            res.status(500).send('Error fetching Oscars by category.');
        }
    });

    router.get('/film/:title', async function (req, res, next) {
        try {
            const {title} = req.params;
            const request_url = `http://localhost:3001/oscar/film/${title}`;
            const response = await axios.get(request_url);
            const oscarsByFilm = response.data;

            console.log(oscarsByFilm);

            res.render('oscars/single_movie_oscars', {
                movie_title: ` ${title}`,
                oscarsByFilm: oscarsByFilm[0]
            });
        } catch (error) {
            console.error('Error fetching Oscars by film:', error);
            res.status(500).send('Error fetching Oscars by film.');
        }
    });

    router.get('/all', async function (req, res, next) {
        try {
            const request_url = 'http://localhost:3001/oscar/all'; // Endpoint corretto
            console.log('Requesting:', request_url);

            const response = await axios.get(request_url);
            console.log('Response received from server1:', response.data);

            const oscars = response.data;

            res.render('oscars/all', {
                title: 'All Oscars',
                oscars
            });
        } catch (error) {
            console.error('Error fetching Oscar details:', error.message);
            console.error('Error details:', error);
            res.status(500).send('Error fetching Oscar details.');
        }
    });

    router.get('/', async function (req, res, next) {
        try {
            const request_url = 'http://localhost:3001/oscar'; // URL del server1
            const response = await axios.get(request_url);
            const overview = response.data;

            res.render('oscars/overview', {
                title: 'Oscar API Overview',
                overview
            });
        } catch (error) {
            console.error('Error fetching Oscar overview:', error);
            res.status(500).send('Error fetching Oscar overview.');
        }
    });

    return router;

}


/*
* da provare:
* 	•	http://localhost:3000/oscars → Overview.
	•	http://localhost:3000/oscars/all → Elenco completo.
	•	http://localhost:3000/oscars/film/Inception → Ricerca per film.
	•	http://localhost:3000/oscars/category/SOUND → Ricerca per categoria.
	•	http://localhost:3000/oscars/year/2020 → Ricerca per anno.
	•	http://localhost:3000/oscars/top/5 → Top film.
* */