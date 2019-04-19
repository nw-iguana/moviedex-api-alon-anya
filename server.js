require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const movies = require('./moviedex.json');
const helmet = require('helmet');
const cors = require('cors');
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());

app.use(
  (validateBearerToken = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }

    next();
  })
);

const handleGetMovies = (req, res) => {
  let response = movies;
  const genre = req.query.genre;
  const country = req.query.country;
  let avg_vote = parseFloat(req.query.avg_vote);

  if (genre) {
    response = response.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if (country) {
    response = response.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  if (avg_vote) {
    response = response.filter(movie => {
      return movie.avg_vote >= avg_vote;
    });
  }

  res.json(response);
};

app.get('/movie', handleGetMovies);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
