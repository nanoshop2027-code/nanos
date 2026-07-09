const eventBookingService = require('../services/eventBookingService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get all event bookings
// @route   GET /api/v1/admin/event-bookings
// @access  Private (Admin/Super Admin)
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const { bookings, pagination } = await eventBookingService.listForAdmin(req.query);
  sendSuccess(res, 'Event bookings retrieved successfully', { bookings, pagination });
});

// @desc    Get an event booking by ID
// @route   GET /api/v1/admin/event-bookings/:id
// @access  Private (Admin/Super Admin)
exports.getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await eventBookingService.findByIdScoped(req.params.id, { isAdmin: true });
  sendSuccess(res, 'Event booking retrieved successfully', { booking });
});

// @desc    Update event booking status
// @route   PATCH /api/v1/admin/event-bookings/:id/status
// @access  Private (Admin/Super Admin)
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await eventBookingService.updateStatus(req.params.id, req.body.status);
  sendSuccess(res, 'Event booking status updated successfully', { booking });
});

// @desc    Update actual number of guests
// @route   PATCH /api/v1/admin/event-bookings/:id/actual-guests
// @access  Private (Admin/Super Admin)
exports.updateActualGuests = asyncHandler(async (req, res, next) => {
  const booking = await eventBookingService.updateActualGuests(
    req.params.id,
    req.body.actualNumberOfGuests
  );
  sendSuccess(res, 'Actual number of guests updated successfully', { booking });
});

// @desc    Update internal notes
// @route   PATCH /api/v1/admin/event-bookings/:id/internal-notes
// @access  Private (Admin/Super Admin)
exports.updateInternalNotes = asyncHandler(async (req, res, next) => {
  const booking = await eventBookingService.updateInternalNotes(
    req.params.id,
    req.body.internalNotes
  );
  sendSuccess(res, 'Internal notes updated successfully', { booking });
});
