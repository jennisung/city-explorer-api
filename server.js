'use strict';

console.log("first server");

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const getMovies = require('./modules/movies');
const getWeather = require('./modules/weather');

// DATA JSON TO USE
// let data = require('./data/weather.json');
const app = express();

//MIDDLEWARE
app.use(cors());


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));


app.get('/movies', getMovies);

app.get('/weather', getWeather);


app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});



