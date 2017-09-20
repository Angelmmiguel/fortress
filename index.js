// Imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
const morgan = require('morgan');

// App imports
const mongoConnect = require('./mongo/connect');

// Port
const port = process.env.PORT || 3001;

// Salt
const salt = process.env.SALT_ROUNDS ?  parseInt(process.env.SALT_ROUNDS) : 10;

// Initialize
const app = express();
const http = require('http').Server(app);

// MongoClient instance. It will be initiated later
let mongoClient;

// Configure
app.use(express.static('client/build'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.MONGO_URI })
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

// Configure passport
passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  (email, password, done) => {
    mongoClient.collection('players').findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (err || !res) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  mongoClient.collection('players').findOne(id, (err, user) => {
    done(err, user);
  });
});

// Initialize MongoDB before start the server
mongoConnect().then(_mongoClient => {
  // Store the client
  mongoClient = _mongoClient;

  // TEST DATA!
  mongoClient.collection('players').insertOne( {
    name: 'Angel',
    message: 'Hello World'
  }, function(err, result) {
    if (err == null) {
      console.log('Inserted a document into the players collection.');
    } else {
      console.error(`Error inserting the test json: ${err}`);
    }
  });

  // Create the server
  http.listen(port, () => {
    console.log('Our app is running on http://fortress.docker');
  });
}).catch(err => {
  console.log(`Error connecting mongodb: ${err}`);
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/api', (req, res) => {
  mongoClient.collection('players').findOne({ name: 'Angel' }, (err, item) => {
    if (err == null) {
      res.send({
        message: item.message
      });
    } else {
      res.send(`Error: ${err}`);
    }
  });
});

// Login
app.post('/api/login',
  passport.authenticate('local'),
  (req, res) => {
    res.json({
      user: req.user
    });
  }
);

app.post('/api/register', (req, res) => {
  bcrypt.hash(req.body.password, salt, (err, encrypted) => {
    if (err) {
      console.log(`here ${encrypted}`)
      res.json({
        error: true,
        message: err
      });
    } else {
      mongoClient.collection('players').insertOne({
        email: req.body.email,
        password: encrypted
      }, function(err, result) {
        console.log('here2')
        if (err == null) {
          res.json({
            user: result
          });
        } else {
          res.json({
            error: true,
            message: err
          });
        }
      });
    }
  });
});

// Fallback to the frontend app
app.get('*', (req, res) => {
  res.sendfile(__dirname + '/client/build/index.html');
});
