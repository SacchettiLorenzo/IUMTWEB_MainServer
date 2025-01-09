const express = require('express');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const parser = new Parser();
const feedUrl = 'https://www.cinemablend.com/rss/topic/news/movies';

// Funzione per estrarre la prima immagine da una pagina HTML
async function extractFirstImage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Cerca l'immagine con la classe specifica "block-image-ads hero-image"
        const image = $('img.block-image-ads.hero-image').attr('src') ||
            $('img.block-image-ads.hero-image').attr('data-original-mos');

        return image || '/public/images/default-news.jpg'; // Immagine di default se non trovata
    } catch (error) {
        console.error(`Error fetching image from ${url}:`, error.message);
        return '/public/images/default-news.jpg'; // Immagine di default in caso di errore
    }
}

// Route per la pagina delle news
router.get('/', async (req, res) => {
    try {
        const feed = await parser.parseURL(feedUrl);

        // Mappa le notizie e recupera le immagini
        const newsWithImages = await Promise.all(
            feed.items.map(async item => {
                const imageUrl = await extractFirstImage(item.link);
                return {
                    title: item.title,
                    link: item.link,
                    description: item.contentSnippet || item.description,
                    pubDate: new Date(item.pubDate).toLocaleDateString(),
                    imageUrl
                };
            })
        );

        // Gestisce richieste AJAX (homepage) o render della pagina
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(newsWithImages.slice(0, 5)); // Limitiamo a 5 notizie per la homepage
        }

        // Renderizza la pagina completa con tutte le notizie
        res.render('news/news', { title: 'Latest News', news: newsWithImages });
    } catch (error) {
        console.error('Error fetching RSS feed:', error.message);
        res.status(500).render('error', { message: 'Error fetching news' });
    }
});

module.exports = router;