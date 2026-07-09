const businessSettingsService = require('../services/businessSettingsService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get business settings
// @route   GET /api/v1/customer/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await businessSettingsService.getSettings();
  sendSuccess(res, 'Business settings retrieved successfully', { settings });
});
