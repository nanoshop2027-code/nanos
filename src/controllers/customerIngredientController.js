const ingredientService = require('../services/ingredientService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get all ingredients of a type
// @route   GET /api/v1/customer/ingredients/:type
// @access  Public
exports.getAllIngredients = asyncHandler(async (req, res, next) => {
  const ingredients = await ingredientService.findAll(req.ingredientType);
  sendSuccess(res, 'Ingredients retrieved successfully', { ingredients });
});

// @desc    Get single ingredient
// @route   GET /api/v1/customer/ingredients/:type/:id
// @access  Public
exports.getIngredientById = asyncHandler(async (req, res, next) => {
  const ingredient = await ingredientService.findById(req.ingredientType, req.params.id);
  sendSuccess(res, 'Ingredient retrieved successfully', { ingredient });
});
