const axios = require('axios');
//CACHE
let cache = {};


async function getMovies(request, response, next) {
  try {
    let keywordFromFrontTwo = request.query.searchQuery;
    let movieKey = `${keywordFromFrontTwo}-movie`;

    if(cache[movieKey] && (Date.now() - cache[movieKey].timestamp < 8.64e+7) ){
      console.log('Movie: Cache was Hit', cache);

      response.status(200).send(cache[movieKey].data);

    } else {
      console.log('Movie: No Item in cache');
      let moviesAPIURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${keywordFromFrontTwo}`;
      let movieDataFromAxios = await axios.get(moviesAPIURL);
      let moviesData = movieDataFromAxios.data.results.map(movieObj => new Movie(movieObj));
      response.status(200).send(moviesData);

      cache[movieKey] = {
        timestamp: Date.now(),
        data: moviesData,

      }

    }

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