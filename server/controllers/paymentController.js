import Booking from "../models/Booking.js";

// Mock payment processing (replace with actual payment gateway integration)
export const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, paymentDetails } = req.body;
    const { userId } = req.auth();

    // Find the booking
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid"
      });
    }

    // Mock payment processing
    // In production, integrate with Stripe, PayPal, or other payment gateways
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate payment success
    const paymentSuccessful = true; // This would be determined by the payment gateway

    if (paymentSuccessful) {
      // Update booking with payment information
      booking.isPaid = true;
      booking.paymentId = paymentId;
      booking.status = 'confirmed';
      await booking.save();

      res.json({
        success: true,
        message: "Payment processed successfully",
        paymentId,
        booking
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment failed"
      });
    }

  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
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

    res.json({
      success: true,
      isPaid: booking.isPaid,
      paymentId: booking.paymentId,
      status: booking.status
    });

  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
      error: error.message
    });
  }
};

// Refund payment (admin only)
export const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (!booking.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Booking is not paid"
      });
    }

    // Mock refund processing
    // In production, process refund through payment gateway
    booking.isPaid = false;
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: "Refund processed successfully",
      booking
    });

  } catch (error) {
    console.error("Refund processing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message
    });
  }
};
