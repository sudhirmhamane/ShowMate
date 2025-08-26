import express from 'express';
import { 
  getDashboardStats, 
  deleteShow, 
  updateShow, 
  getSystemHealth 
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/auth.js';

const adminRouter = express.Router();

// All routes require admin authentication
adminRouter.use(protectAdmin);

// Dashboard and statistics
adminRouter.get('/dashboard', getDashboardStats);
adminRouter.get('/health', getSystemHealth);

// Show management
adminRouter.put('/shows/:showId', updateShow);
adminRouter.delete('/shows/:showId', deleteShow);

export default adminRouter;
