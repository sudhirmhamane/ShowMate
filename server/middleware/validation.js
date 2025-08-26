import { validateSeatSelection, isValidDate, isValidEmail } from '../utils/helpers.js';

// Validate movie data
export const validateMovieData = (req, res, next) => {
  const { title, overview, poster_path, backdrop_path, release_date, genres, casts, vote_average, runtime } = req.body;

  if (!title || !overview || !poster_path || !backdrop_path || !release_date || !genres || !casts || !vote_average || !runtime) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  if (typeof vote_average !== 'number' || vote_average < 0 || vote_average > 10) {
    return res.status(400).json({
      success: false,
      message: 'Vote average must be a number between 0 and 10'
    });
  }

  if (typeof runtime !== 'number' || runtime <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Runtime must be a positive number'
    });
  }

  if (!Array.isArray(genres) || genres.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Genres must be a non-empty array'
    });
  }

  if (!Array.isArray(casts) || casts.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Casts must be a non-empty array'
    });
  }

  next();
};

// Validate show data
export const validateShowData = (req, res, next) => {
  const { movieId, showInput, showPrice } = req.body;

  if (!movieId || !showInput || !showPrice) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  if (typeof showPrice !== 'number' || showPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Show price must be a positive number'
    });
  }

  if (!Array.isArray(showInput) || showInput.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Show input must be a non-empty array'
    });
  }

  for (const show of showInput) {
    if (!show.date || !show.time || !Array.isArray(show.time) || show.time.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Each show must have a date and time array'
      });
    }

    if (!isValidDate(show.date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    for (const time of show.time) {
      if (typeof time !== 'string' || !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format. Use HH:MM format'
        });
      }
    }
  }

  next();
};

// Validate booking data
export const validateBookingData = (req, res, next) => {
  const { showId, selectedSeats, amount } = req.body;

  if (!showId || !selectedSeats || !amount) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number'
    });
  }

  const seatValidation = validateSeatSelection(selectedSeats);
  if (!seatValidation.valid) {
    return res.status(400).json({
      success: false,
      message: seatValidation.message
    });
  }

  next();
};

// Validate user data
export const validateUserData = (req, res, next) => {
  const { name, email, image } = req.body;

  if (!name || !email || !image) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  if (typeof image !== 'string' || !image.startsWith('http')) {
    return res.status(400).json({
      success: false,
      message: 'Image must be a valid URL'
    });
  }

  next();
};

// Validate payment data
export const validatePaymentData = (req, res, next) => {
  const { bookingId, paymentMethod, paymentDetails } = req.body;

  if (!bookingId || !paymentMethod || !paymentDetails) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided'
    });
  }

  if (!['card', 'paypal', 'bank_transfer'].includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment method'
    });
  }

  if (paymentMethod === 'card') {
    const { cardNumber, expiryMonth, expiryYear, cvv } = paymentDetails;
    
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({
        success: false,
        message: 'Card details are incomplete'
      });
    }

    if (!cardNumber.match(/^\d{16}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number format'
      });
    }

    if (!expiryMonth.match(/^(0[1-9]|1[0-2])$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expiry month'
      });
    }

    if (!expiryYear.match(/^\d{4}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expiry year'
      });
    }

    if (!cvv.match(/^\d{3,4}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CVV'
      });
    }
  }

  next();
};

// Validate search query
export const validateSearchQuery = (req, res, next) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters long'
    });
  }

  next();
};

// Validate pagination
export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Page must be a positive number'
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }

  next();
};
