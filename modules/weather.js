const axios = require('axios');

//CACHE
let cache = {};

async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let weatherKey = `${lat}-latitude${lon}-longitude`;

    if(cache[weatherKey] && (Date.now() - cache[weatherKey].timestamp < 8.64e+7) ) {
      console.log('Weather: Cache was Hit', cache);

      response.status(200).send(cache[weatherKey].data);


    } else {
      console.log('Weather: No Item in cache');
      let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
      let weatherDataFromAxios = await axios.get(weatherURL);
      let weatherData = weatherDataFromAxios.data.data.map(cityObj => new Forecast(cityObj));
      response.status(200).send(weatherData);


      cache[weatherKey] = {
        timestamp: Date.now(),
        data: weatherData,
      };

    }
  } catch (error) {
    next(error);
  }
}


class Forecast {
  constructor(cityObj) {
    this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}


module.exports = getWeather;