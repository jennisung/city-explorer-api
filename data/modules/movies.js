const axios = require('axios');

async function getMovies(request, response, next) {
  try {
    let keywordFromFrontTwo = request.query.searchQuery;
    let moviesAPIURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${keywordFromFrontTwo}`;
    let movieDataFromAxios = await axios.get(moviesAPIURL);
    let moviesData = movieDataFromAxios.data.results.map(movieObj => new Movie(movieObj));
    response.status(200).send(moviesData);
  } catch (error) {
    next(error);
  }
}

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

module.exports = getMovies;