import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: {
          path: 'movie',
          model: 'Movie'
        }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get revenue statistics
    const totalRevenue = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          isPaid: true,
          createdAt: { 
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
          } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalShows,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      },
      recentBookings
    });

  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

// Delete show (admin only)
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;

    // Check if there are any bookings for this show
    const existingBookings = await Booking.find({ show: showId });
    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete show with existing bookings"
      });
    }

    const show = await Show.findByIdAndDelete(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    res.json({
      success: true,
      message: "Show deleted successfully"
    });

  } catch (error) {
    console.error("Delete show error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete show",
      error: error.message
    });
  }
};

// Update show details
export const updateShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const { showDateTime, showPrice } = req.body;

    const show = await Show.findByIdAndUpdate(
      showId,
      { showDateTime, showPrice },
      { new: true, runValidators: true }
    );

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    res.json({
      success: true,
      message: "Show updated successfully",
      show
    });

  } catch (error) {
    console.error("Update show error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update show",
      error: error.message
    });
  }
};

// Get system health
export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime()
    };

    // Test database connection
    try {
      await Show.findOne();
      dbStatus.database = 'connected';
    } catch (error) {
      dbStatus.database = 'disconnected';
      dbStatus.status = 'unhealthy';
    }

    res.json({
      success: true,
      health: dbStatus
    });

  } catch (error) {
    console.error("Get system health error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get system health",
      error: error.message
    });
  }
};
