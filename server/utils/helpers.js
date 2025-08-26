import { v4 as uuidv4 } from 'uuid';

// Generate unique ID
export const generateId = () => uuidv4();

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim();
};

// Generate random string
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Calculate time difference
export const getTimeDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2));
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day(s)`;
  if (hours > 0) return `${hours} hour(s)`;
  if (minutes > 0) return `${minutes} minute(s)`;
  return 'Just now';
};

// Validate date format
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Check if date is in the future
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

// Generate seat ID
export const generateSeatId = (row, number) => {
  return `${row}${number.toString().padStart(2, '0')}`;
};

// Calculate total amount for seats
export const calculateTotalAmount = (seatCount, pricePerSeat) => {
  return seatCount * pricePerSeat;
};

// Validate seat selection
export const validateSeatSelection = (seats, maxSeats = 5) => {
  if (!Array.isArray(seats) || seats.length === 0) {
    return { valid: false, message: 'Please select at least one seat' };
  }
  
  if (seats.length > maxSeats) {
    return { valid: false, message: `You can only select up to ${maxSeats} seats` };
  }
  
  // Validate seat format (e.g., A1, B2, etc.)
  const seatRegex = /^[A-Z]\d{1,2}$/;
  for (const seat of seats) {
    if (!seatRegex.test(seat)) {
      return { valid: false, message: 'Invalid seat format' };
    }
  }
  
  return { valid: true };
};

// Pagination helper
export const paginateResults = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit, page: parseInt(page) };
};

// Response wrapper
export const apiResponse = (success, data, message = '', statusCode = 200) => {
  return {
    success,
    data,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };
};

// Error response wrapper
export const errorResponse = (message, statusCode = 500, error = null) => {
  return {
    success: false,
    message,
    statusCode,
    error: process.env.NODE_ENV === 'development' ? error : null,
    timestamp: new Date().toISOString()
  };
};
