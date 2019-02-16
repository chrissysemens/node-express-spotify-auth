var bodyParser = require('body-parser');
var express = require('express');
var callback = require('./routes/callback');
var cookieParser = require('cookie-parser');
var express = require('express');
var logger = require('morgan');
require('dotenv').config();

/* Import Routes */
var home = require('./routes/home');
var callback = require('./routes/callback');
var error = require('./routes/error');
var login = require('./routes/login');

/* Instansiate the App */
var app = express()
app.set('port', (process.env.PORT || 5000))

/* App setup */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'))

/* View Engine setup */
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

/* Routes setup */
app.use('/', home);
app.use('/callback', callback);
app.use('/error', error);
app.use('/login', login);

app.get('*',function (req, res) {
  res.redirect('/');
});

/* Error Handlers */
// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* App Go! */
app.listen(app.get('port'), function() {
  console.log("Spotify Auth Code token exchange is running on:" + app.get('port'))
})