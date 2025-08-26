import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { showId, selectedSeats, amount } = req.body;
    const { userId } = req.auth();

    // Validate show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    // Check if seats are available
    const occupiedSeats = show.occupiedSeats || {};
    const seatsToBook = selectedSeats.filter(seat => !occupiedSeats[seat]);
    
    if (seatsToBook.length !== selectedSeats.length) {
      return res.status(400).json({
        success: false,
        message: "Some selected seats are already occupied"
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      bookedSeats: selectedSeats,
      amount: amount
    });

    // Update show with occupied seats
    const updatedOccupiedSeats = { ...occupiedSeats };
    selectedSeats.forEach(seat => {
      updatedOccupiedSeats[seat] = userId;
    });

    await Show.findByIdAndUpdate(showId, {
      occupiedSeats: updatedOccupiedSeats
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth();

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message
    });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie'
        }
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking
    });

  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId } = req.auth();

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    // Update show to free up seats
    const show = await Show.findById(booking.show);
    if (show) {
      const updatedOccupiedSeats = { ...show.occupiedSeats };
      booking.bookedSeats.forEach(seat => {
        delete updatedOccupiedSeats[seat];
      });

      await Show.findByIdAndUpdate(booking.show, {
        occupiedSeats: updatedOccupiedSeats
      });
    }

    // Cancel booking
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message
    });
  }
};
