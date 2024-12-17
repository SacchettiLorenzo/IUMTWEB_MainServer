var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movies');

var app = express();

// Configurazione del motore di template (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware di Express
app.use(logger('dev')); // Log delle richieste
app.use(express.json()); // Parsing JSON
app.use(express.urlencoded({ extended: false })); // Parsing dei dati del form
app.use(cookieParser()); // Gestione dei cookie
app.use(express.static(path.join(__dirname, 'public')));

// Definizione delle route
app.use('/', indexRouter);
app.use('/movies', moviesRouter);

// Gestione errori 404
app.use(function (req, res, next) {
  res.status(404).render('error', { message: 'Page not found', error: {} });
});

// Gestione degli errori generici
app.use(function (err, req, res, next) {
  // Fornisci errori solo in ambiente di sviluppo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizza la pagina di errore
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;