const cupCategoryService = require('../services/cupCategoryService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get all cup categories
// @route   GET /api/v1/customer/categories
// @access  Public
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await cupCategoryService.findAll();
  sendSuccess(res, 'Cup categories retrieved successfully', { categories });
});

// @desc    Get single cup category
// @route   GET /api/v1/customer/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await cupCategoryService.findById(req.params.id);
  sendSuccess(res, 'Cup category retrieved successfully', { category });
});
