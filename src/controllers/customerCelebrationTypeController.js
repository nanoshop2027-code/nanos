const celebrationTypeService = require('../services/celebrationTypeService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get all celebration types
// @route   GET /api/v1/customer/celebration-types
// @access  Public
exports.getAllCelebrationTypes = asyncHandler(async (req, res, next) => {
  const celebrationTypes = await celebrationTypeService.findAll();
  sendSuccess(res, 'Celebration types retrieved successfully', { celebrationTypes });
});
