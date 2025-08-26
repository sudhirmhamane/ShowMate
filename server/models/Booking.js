import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      ref: 'User'
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Show'
    },
    bookedSeats: [{
      type: String,
      required: true
    }],
    amount: {
      type: Number,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
