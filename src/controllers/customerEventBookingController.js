const eventBookingService = require('../services/eventBookingService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Create an event booking
// @route   POST /api/v1/customer/event-bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  const booking = await eventBookingService.createBooking(req.user, req.body);
  sendSuccess(res, 'Event booking submitted successfully', { booking }, 201);
});

// @desc    Get my event bookings
// @route   GET /api/v1/customer/event-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const { bookings, pagination } = await eventBookingService.listForUser(req.user._id, req.query);
  sendSuccess(res, 'Event bookings retrieved successfully', { bookings, pagination });
});

// @desc    Get my event booking details
// @route   GET /api/v1/customer/event-bookings/:id
// @access  Private
exports.getMyBookingById = asyncHandler(async (req, res, next) => {
  const booking = await eventBookingService.findByIdScoped(req.params.id, {
    userId: req.user._id,
    isAdmin: false,
  });
  sendSuccess(res, 'Event booking retrieved successfully', { booking });
});
