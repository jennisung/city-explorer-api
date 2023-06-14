'use strict';

console.log("first server");

// REQUIRED: like import but for backend
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// DATA JSON TO USE
let data = require('./data/weather.json');
//creating server using express
// app === my server
const app = express();

//MIDDLEWARE

app.use(cors());

// DEFINE MY PORT FOR MY SERVER
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));


// LAB 7: CLASS TO GROOM BULKY DATA
class Forecast {
  constructor(cityObj) {
    this.date = cityObj.valid_date;
    this.description = cityObj.weather.description;
  }
}

// LAB 7: WEATHER LAB 
app.get('/weather', (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    // TODO: GRAB THE QUERY FROM THE REQUEST .QUERY OBJECT
    let searchQuery = request.query.searchQuery;

    console.log('Search Query:', data);
    // TODO: USE THAT QUERY TO FIND A CITY THAT MATCHES
    let foundCity = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());

    console.log('Found City:', foundCity);

    if (foundCity) {
      // TODO: PROCESS WEATHER DATA FOR THE FOUND CITY
      let weatherForecast = foundCity.data.map(date => new Forecast(date));
      response.status(200).send(weatherForecast);
    } else {
      response.status(404).send('CANNOT BE FOUND');
    }
  } catch (error) {
    response.status(500).send(error.message);
    next(error);
  }
});

// console.log('Search Query:', searchQuery);
// console.log('Found City:', foundCity);

// // LAB 7: CLASS TO GROOM BULKY DATA
// class Forecast {
//   constructor(cityObj) {
//     this.date = cityObj.valid_date;
//     this.description = cityObj.weather.description;
//   }
// }


// CATCH ALL ENDPOINT - needs to be last endpoint defined
app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
});

// ERROR HANDLING - PLUG AND PLAY CODE FORM EXPRESS DOCS
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});




