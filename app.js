var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');

global.SQLBrokerHost = "http://localhost:8080";
global.NoSQLBrokerHost = "http://localhost:8081";


const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const actorsRouter = require('./routes/actors');
const crewRouter = require('./routes/crew');
const oscarsRouter = require('./routes/oscars');
const countriesRouter = require('./routes/countries');
const releasesRouter = require('./routes/releases');
const studiosRouter = require('./routes/studios');
const themesRouter = require('./routes/themes');


var app = express();

//the components inside /movies can be used inside other components
hbs.registerPartials(__dirname + '/views/movies');
hbs.registerPartials(__dirname + '/views/actors');
hbs.registerPartials(__dirname + '/views/crew');
hbs.registerPartials(path.join(__dirname, '/views/oscars'));
hbs.registerPartials(path.join(__dirname, '/views/themes'));


hbs.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});


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
app.use('/oscars', oscarsRouter);
app.use('/countries', countriesRouter);
app.use('/releases', releasesRouter);
app.use('/studios', studiosRouter);
app.use('/themes', themesRouter);

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