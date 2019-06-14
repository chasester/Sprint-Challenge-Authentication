const axios = require('axios');
const db = require('../database/db_model');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let {username, password} = req.body;
  if(!username || username === "" || !password || password === "") return res.status(400).json({error: "invalid data in body", message: "must enter a username and password"})
  db.register(username, password)
  .then(result => res.status(201).json(result))
  .catch(err => res.status(400).json({error: "invalid request", message: err}));
}

function login(req, res) {
  // implement user login
  let {username, password} = req.body;
  if(!username || username === "" || !password || password === "") return res.status(400).json({error: "invalid data in body", message: "must enter a username and password"})
  db.login(username,password)
  .then(result => res.status(201).json(result))
  .catch(err => res.status(400).json({error: "invalid request", message: err}));
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };
  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
