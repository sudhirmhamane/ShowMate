import express from 'express'
import { addShow, getNowPlayingMovies, getShow, getShows } from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js';

const showRouter = express.Router();

// Public routes
showRouter.get('/now-playing', getNowPlayingMovies);
showRouter.get('/all', getShows);
showRouter.get('/:movieId', getShow);

// Admin routes
showRouter.post('/add', protectAdmin, addShow);

export default showRouter;