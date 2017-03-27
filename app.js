// requirements
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

// connect mongoose to databse
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

// routes
var routes = require('./routes/index');
var users = require('./routes/users');

// init App
var app = express();

// View Engine setup

  //set views folder to handle views
  app.set('views', path.join(__dirname, 'views'));
  // set handlebars as app.engine and handlebars as layout
  app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
  // set view engine to handlebars
  app. set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CookieParser Middleware
app.use(cookieParser());

// Set public folder as static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Flash Middleware for connection
app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes Middleware
app.use('/', routes);
app.use('/users', users)

// Set Port
app.set('port', (process.env.PORT || 3000));

// Listen to port and transmit a success message
app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});