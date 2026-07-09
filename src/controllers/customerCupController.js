const cupService = require('../services/cupService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get all menu cups (search, filter, sort, pagination)
// @route   GET /api/v1/customer/cups
// @access  Public
exports.getAllCups = asyncHandler(async (req, res, next) => {
  const { cups, pagination } = await cupService.findAll(req.query);
  sendSuccess(res, 'Cups retrieved successfully', { cups, pagination });
});

// @desc    Get a menu cup with full details
// @route   GET /api/v1/customer/cups/:id
// @access  Public
exports.getCupById = asyncHandler(async (req, res, next) => {
  const cup = await cupService.findById(req.params.id);
  sendSuccess(res, 'Cup retrieved successfully', { cup });
});
