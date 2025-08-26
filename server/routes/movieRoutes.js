import express from 'express';
import { 
  searchMovies, 
  getMovieDetails, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getMoviesByGenre 
} from '../controllers/movieController.js';

const movieRouter = express.Router();

// Public routes
movieRouter.get('/search', searchMovies);
movieRouter.get('/popular', getPopularMovies);
movieRouter.get('/top-rated', getTopRatedMovies);
movieRouter.get('/upcoming', getUpcomingMovies);
movieRouter.get('/genre/:genreId', getMoviesByGenre);
movieRouter.get('/:movieId', getMovieDetails);

export default movieRouter;
