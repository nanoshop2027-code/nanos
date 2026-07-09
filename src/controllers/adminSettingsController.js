const businessSettingsService = require('../services/businessSettingsService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get business settings
// @route   GET /api/v1/admin/settings
// @access  Private (Admin/Super Admin)
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await businessSettingsService.getSettings();
  sendSuccess(res, 'Business settings retrieved successfully', { settings });
});

// @desc    Update business settings
// @route   PUT /api/v1/admin/settings
// @access  Private (Admin/Super Admin)
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await businessSettingsService.updateSettings(req.body);
  sendSuccess(res, 'Business settings updated successfully', { settings });
});
