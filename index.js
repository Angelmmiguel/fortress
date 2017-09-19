// Imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

// App imports
const mongoConnect = require('./mongo/connect');

// Port
const port = process.env.PORT || 3001;

// Initialize
const app = express();
const http = require('http').Server(app);

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

// MongoClient instance. It will be initiated later
let mongoClient;

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
  })
});

// Fallback to the frontend app
app.get('*', (req, res) => {
  res.sendfile(__dirname + '/client/build/index.html');
});
