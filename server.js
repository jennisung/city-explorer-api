'use strict';

console.log("first server");

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const getMovies = require('./data/modules/movies');

// DATA JSON TO USE
// let data = require('./data/weather.json');
const app = express();

//MIDDLEWARE
app.use(cors());


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));


///movies?searchQuery=seattle
app.get('/movies', getMovies);


class Forecast {
  constructor(cityObj) {
    this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}

// http://localhost/weather?lat=47.6062&lon=-122.3321
app.get('/weather', async (request, response, next) => {

  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
    let weatherDataFromAxios = await axios.get(weatherURL);
    console.log(weatherDataFromAxios.data);
    let weatherData = weatherDataFromAxios.data.data.map(cityObj => new Forecast(cityObj));

    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
});


app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});



