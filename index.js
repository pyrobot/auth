var https = require('https'),
    fs = require('fs'),
    express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    app = express(),
    db = {};

var options = {
  key: fs.readFileSync('ryans-key.pem'),
  cert: fs.readFileSync('ryans-cert.pem')
};

db.users = require('./users');

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.users.find(id, function (err, user) {
    done(err, user);
  });
});

app.configure(function () {
  app.use(express.favicon());
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({key: 'S', secret:'sauce', cookie: { secure: true, maxAge: 900000 }})); //15min
  app.use(passport.initialize());
  app.use(passport.session());
});

app.get('/', function (req, res) {
  var user = req.user || {},
      name = user.username || '';

  res.end('Hello ' + name);
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/secret', ensureLoggedIn(), function (req, res) {
  res.locals.user = req.user;
  res.render('secrets');
});

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

var server = https.createServer(options, app),
    serverPort = 8000;

server.listen(serverPort, function () { console.log("Server started on port %s", serverPort); });

