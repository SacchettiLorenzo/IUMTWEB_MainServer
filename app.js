var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs')

global.SQLBrokerHost = "http://localhost:8080";
global.NoSQLBrokerHost = "http://localhost:8081";


var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movies');
var actorsRouter = require('./routes/actors');
var crewRouter = require('./routes/crew');

var app = express();

//the components inside /movies can be used inside other components
hbs.registerPartials(__dirname + '/views/movies')
hbs.registerPartials(__dirname + '/views/actors')
hbs.registerPartials(__dirname + '/views/crew')


// Configurazione del motore di template (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware di Express
app.use(logger('dev')); // Log delle richieste
app.use(express.json()); // Parsing JSON
app.use(express.urlencoded({ extended: false })); // Parsing dei dati del form
app.use(cookieParser()); // Gestione dei cookie
app.use('/public', express.static(path.join(__dirname, 'public')));

// Definizione delle route
app.use('/', indexRouter);
app.use('/movies', moviesRouter);
app.use('/actors', actorsRouter);
app.use('/crew', crewRouter);

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