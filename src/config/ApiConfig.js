const baseApiUrl = 'http://localhost:5000'
const apiVersion = '/api/v1'

const generateMovieUrl = (directorId, movieId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}`;
};

const generateActorUrl = (actorId) => {
  return `${baseApiUrl}${apiVersion}/actors/${actorId}`;
};

const generateDirectorUrl = (directorId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}`;
};

const generateMovieReviewsUrl = (directorId, movieId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/reviews`;
};

const generateDeleteMovieReviewUrl = (directorId, movieId, reviewId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/reviews/${reviewId}`;
};

const generateGetUserUrl = (userId) => {
  return `${baseApiUrl}${apiVersion}/users/${userId}`;
};

const generateAddToWatchlistUrl = (directorId, movieId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/watchlist`;
};

const generateAddToWatchedMoviesUrl = (directorId, movieId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/watched`;
};

const generateRateMovieUrl = (directorId, movieId, rating) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/rate/${rating}`;
};

const generateLikeUrl = (directorId, movieId, reviewId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/reviews/${reviewId}/likes`;
};

const generateDislikeUrl = (directorId, movieId, reviewId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies/${movieId}/reviews/${reviewId}/dislikes`;
};

const generateCreateMovieUrl = (directorId) => {
  return `${baseApiUrl}${apiVersion}/directors/${directorId}/movies`;
};

const generateEditUserUrl = (userId) => {
  return `${baseApiUrl}${apiVersion}/users/${userId}`;
};


const apiUrls = {
    register: `${baseApiUrl}${apiVersion}/users`,
    login: `${baseApiUrl}${apiVersion}/login`,
    logout: `${baseApiUrl}${apiVersion}/logout`,
    movies: `${baseApiUrl}${apiVersion}/movies`,
    actors: `${baseApiUrl}${apiVersion}/actors`,
    directors: `${baseApiUrl}${apiVersion}/directors`,
    refreshToken: `${baseApiUrl}${apiVersion}/refresh/token`,
    watchlist: `${baseApiUrl}${apiVersion}/movies/watchlist`,
    watchedMovies: `${baseApiUrl}${apiVersion}/movies/watched`,
    users: `${baseApiUrl}${apiVersion}/users`,
    generateRateMovieUrl,
    generateCreateMovieUrl,
    generateMovieUrl,
    generateEditUserUrl,
    generateActorUrl,
    generateLikeUrl,
    generateDislikeUrl,
    generateDirectorUrl,
    generateMovieReviewsUrl,
    generateDeleteMovieReviewUrl,
    generateGetUserUrl,
    generateAddToWatchlistUrl,
    generateAddToWatchedMoviesUrl,
  }; 
export default apiUrls;