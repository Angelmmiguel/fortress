// Imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Port
const port = process.env.PORT || 3001;

// Initialize
const app = express();

// Configure
app.use(express.static('client/build'));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

// Fallback to the frontend app
app.get('*', (req, res) => {
  res.sendfile(__dirname + '/client/build/index.html');
});

// Create the server
http.listen(port, () => {
  console.log('Our app is running on http://fortress.docker');
});
