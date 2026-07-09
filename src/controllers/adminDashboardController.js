const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin/Super Admin)
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await dashboardService.getStats();
  sendSuccess(res, 'Dashboard statistics retrieved successfully', { stats });
});
