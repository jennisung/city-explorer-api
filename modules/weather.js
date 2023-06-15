const axios = require('axios');

async function getWeather(request, response, next) {
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
}


class Forecast {
  constructor(cityObj) {
    this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}


module.exports = getWeather;