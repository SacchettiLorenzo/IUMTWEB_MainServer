var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs')

const servers = {
  SQLBrokerHost : "http://localhost:8080/",
  NoSQLBrokerHost : "http://localhost:3001/"
}

const indexRouter = require('./routes/index');
const moviesRouter = require('./routes/movies');
const actorsRouter = require('./routes/actors');
const crewRouter = require('./routes/crew');
const oscarsRouter = require('./routes/oscars');
const countriesRouter = require('./routes/countries');
const releasesRouter = require('./routes/releases');
const studiosRouter = require('./routes/studios');
const themesRouter = require('./routes/themes');
const languagesRouter = require('./routes/languages');
const genresRouter = require('./routes/genres');
const newsRouter = require('./routes/news');
const {render_error} = require('./utils');
const aboutRouter = require('./routes/about');


var app = express();

//the components inside /movies can be used inside other components
hbs.registerPartials(__dirname + '/views/movies')
hbs.registerPartials(__dirname + '/views/actors')
hbs.registerPartials(__dirname + '/views/crew')
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerPartials(__dirname + '/views/oscars');
hbs.registerPartials(__dirname + '/views/homepage');
hbs.registerPartials(__dirname + '/views/channels');
hbs.registerPartials(__dirname + '/views/themes');
hbs.registerPartials(__dirname + '/views/languages');
hbs.registerPartials(__dirname + '/views/genres');
hbs.registerPartials(__dirname + '/views/reviews');
hbs.registerPartials(__dirname + '/views/countries');
hbs.registerPartials(__dirname + '/views/homepage');
hbs.registerPartials(__dirname + '/views/about');
hbs.registerPartials(__dirname + '/views/news');

hbs.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});

hbs.registerHelper('date_formatter', function(date) {
  const date_ = new Date(date);
  return date_.getFullYear() + '-' + (date_.getMonth() + 1) + '-' + date_.getDate();
});

hbs.registerHelper('grouped_each', function(every, context, options) {
  var out = "", subcontext = [], i;
  if (context && context.length > 0) {
    for (i = 0; i < context.length; i++) {
      if (i > 0 && i % every === 0) {
        out += options.fn(subcontext);
        subcontext = [];
      }
      subcontext.push(context[i]);
    }
    out += options.fn(subcontext);
  }
  return out;
});

hbs.registerHelper( "when",function(operand_1, operator, operand_2, options) {
  var operators = {
    'eq': function(l,r) { return l == r; },
    'noteq': function(l,r) { return l != r; },
    'gt': function(l,r) { return Number(l) > Number(r); },
    'or': function(l,r) { return l || r; },
    'and': function(l,r) { return l && r; },
    '%': function(l,r) { return (l % r) === 0; }
  }
      , result = operators[operator](operand_1,operand_2);

  if (result) return options.fn(this);
  else  return options.inverse(this);
});

hbs.registerHelper("add", function (operand_1, operand_2) {
  return operand_1 + operand_2;
})

hbs.registerHelper("sub", function (operand_1, operand_2) {
  return operand_1 - operand_2;
})

hbs.registerHelper("div", function (operand_1, operand_2) {
  return (operand_1 / operand_2);
})



// Configurazione del motore di template (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware per debug del rendering del layout
app.use((req, res, next) => {
  console.log(`Rendering layout for ${req.url}`);
  next();
});

// Middleware di Express
app.use(logger('dev')); // Log delle richieste
app.use(express.json()); // Parsing JSON
app.use(express.urlencoded({ extended: false })); // Parsing dei dati del form
app.use(cookieParser()); // Gestione dei cookie
app.use('/public', express.static(path.join(__dirname, 'public')));

// Definizione delle route
app.use('/', indexRouter({servers:servers}));
app.use('/movies', moviesRouter({servers:servers}));
app.use('/actors', actorsRouter({servers:servers}));
app.use('/crew', crewRouter({servers:servers}));
app.use('/oscars', oscarsRouter({servers:servers}));
app.use('/countries', countriesRouter({servers:servers}));
app.use('/releases', releasesRouter({servers:servers}));
app.use('/studios', studiosRouter({servers:servers}));
app.use('/themes', themesRouter({servers:servers}));
app.use('/languages', languagesRouter({servers:servers}));
app.use('/genres', genresRouter({servers:servers}));
app.use('/about', aboutRouter);
app.use('/news', newsRouter);

app.use((req, res) => {
  render_error(res,404,"The page you are looking for does not exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: err.message,
    is404: false
  });
});

app.get('/error', (req, res) => {
  res.status(500).render('error', {
    message: 'An unexpected error has occurred.'
  });
});

module.exports = app;