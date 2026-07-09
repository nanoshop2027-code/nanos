const customCupService = require('../services/customCupService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Preview a custom cup's calculated calories/pricing (no persistence)
// @route   POST /api/v1/customer/custom-cups/preview
// @access  Public
exports.preview = asyncHandler(async (req, res, next) => {
  const result = await customCupService.preview(req.body);
  sendSuccess(res, 'Custom cup preview calculated successfully', result);
});
