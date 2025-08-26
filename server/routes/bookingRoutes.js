import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getAllBookings, 
  updateBookingStatus, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { protectUser, protectAdmin } from '../middleware/auth.js';

const bookingRouter = express.Router();

// User routes
bookingRouter.post('/create', protectUser, createBooking);
bookingRouter.get('/my-bookings', protectUser, getUserBookings);
bookingRouter.put('/cancel/:bookingId', protectUser, cancelBooking);

// Admin routes
bookingRouter.get('/all', protectAdmin, getAllBookings);
bookingRouter.put('/status/:bookingId', protectAdmin, updateBookingStatus);

export default bookingRouter;
