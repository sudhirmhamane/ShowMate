import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import movieRouter from './routes/movieRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import userRouter from './routes/userRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import adminRouter from './routes/adminRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

// Connect to database
try {
    await connectDb();
} catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working!' });
});

// API routes
app.get('/', (req, res) =>
    res.send('ShowMate Server is Live! 🎬')
);

// Inngest webhook
app.use('/api/inngest', serve({ client: inngest, functions }));

// Core API routes - comment out temporarily to isolate the issue
// app.use('/api/shows', showRouter);
// app.use('/api/movies', movieRouter);
// app.use('/api/bookings', bookingRouter);
// app.use('/api/users', userRouter);
// app.use('/api/payments', paymentRouter);
// app.use('/api/admin', adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(port, () => console.log(`🚀 ShowMate Server running at http://localhost:${port}`));