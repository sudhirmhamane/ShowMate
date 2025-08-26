import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  deleteUser 
} from '../controllers/userController.js';
import { protectUser, protectAdmin } from '../middleware/auth.js';

const userRouter = express.Router();

// User routes
userRouter.get('/profile', protectUser, getUserProfile);
userRouter.put('/profile', protectUser, updateUserProfile);

// Admin routes
userRouter.get('/all', protectAdmin, getAllUsers);
userRouter.delete('/:userId', protectAdmin, deleteUser);

export default userRouter;
