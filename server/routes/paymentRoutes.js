import express from 'express';
import { 
  processPayment, 
  getPaymentStatus, 
  refundPayment 
} from '../controllers/paymentController.js';
import { protectUser, protectAdmin } from '../middleware/auth.js';

const paymentRouter = express.Router();

// User routes
paymentRouter.post('/process', protectUser, processPayment);
paymentRouter.get('/status/:bookingId', protectUser, getPaymentStatus);

// Admin routes
paymentRouter.post('/refund/:bookingId', protectAdmin, refundPayment);

export default paymentRouter;
