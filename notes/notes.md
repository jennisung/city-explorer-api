'use strict';

console.log("first server");

// REQUIRED: like import but for backend
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

// DATA JSON TO USE

// let data = require('./data/weather.json');

//creating server using express
// app === my server
const app = express();

//MIDDLEWARE
app.use(cors());

// DEFINE MY PORT FOR MY SERVER
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));


/*
 *** FOR YOUR LAB - WEATHER
 *** http://api.weatherbit.io/v2.0/forecast/daily?key=<your API key>&lat=<from your frontend>&lon=<from your frontend>&days=5&units=I


 *** FOR YOUR LAB - MOVIES ***
 *** https://api.themoviedb.org/3/search/movie?api_key=<your MOVIE DB KEY>&query=<city info from frontend>
 *** images: https://image.tmdb.org/t/p/w500/<poster path>
*/


//***** */ LAB 8: MOVIE API ********////////////
class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.average_votes;
    this.total_votes = movieObj.total_votes;
    this.imageUrl = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
    this.popularity = movieObj.popularity;
    this.released = movieObj.released_on;


  }
}

///movies?searchQuery=seattle
app.get('/movies', async (request, response, next) => {
  try {
    let keywordFromFrontTwo = request.query.searchQuery;
    let moviesAPIURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${keywordFromFrontTwo}`;
    let movieDataFromAxios = await axios.get(moviesAPIURL);
    let moviesData = movieDataFromAxios.data.results.map(movieObj => new Movie(movieObj));
    response.status(200).send(moviesData);
  } catch (error) {
    next(error);
  }
});


//***** */ LAB 8: WEATHER API ********////////////
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




// CATCH ALL ENDPOINT - needs to be last endpoint defined
app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
});

// ERROR HANDLING - PLUG AND PLAY CODE FORM EXPRESS DOCS
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
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

// weather?searchQuery=paris

// app.get('/weather', async (request, response, next) => {

//   try {
//     let keywordFromFront = request.query.searchQuery;
//     let weatherAPIURL = 
//     let weatherDataFromAxios = await axios.get(weatherAPIURL);
//     response.status(200).send(keywordFromFront);
//   } catch (error) {
//     next(error);
//   }
// });
// LAB 7: CLASS TO GROOM BULKY DATA
// class Forecast {
//   constructor(cityObj) {
//     this.date = cityObj.valid_date;
//     this.description = cityObj.weather.description;
//   }
// }

// LAB 7: WEATHER LAB 
// app.get('/weather', (request, response, next) => {
//   try {
//     let lat = request.query.lat;
//     let lon = request.query.lon;
//     // TODO: GRAB THE QUERY FROM THE REQUEST .QUERY OBJECT
//     let searchQuery = request.query.searchQuery;

//     console.log('Search Query:', data);
//     // TODO: USE THAT QUERY TO FIND A CITY THAT MATCHES
//     let foundCity = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());

//     console.log('Found City:', foundCity);

//     if (foundCity) {
//       // TODO: PROCESS WEATHER DATA FOR THE FOUND CITY
//       let weatherForecast = foundCity.data.map(date => new Forecast(date));
//       response.status(200).send(weatherForecast);
//     } else {
//       response.status(404).send('CANNOT BE FOUND');
//     }
//   } catch (error) {
//     response.status(500).send(error.message);
//     next(error);
//   }
// });

