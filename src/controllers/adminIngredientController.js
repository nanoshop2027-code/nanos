const ingredientService = require('../services/ingredientService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const imageService = require('../services/imageService');

// @desc    Create an ingredient
// @route   POST /api/v1/admin/ingredients/:type
// @access  Private (Admin/Super Admin)
exports.createIngredient = asyncHandler(async (req, res, next) => {
  const data = {
    name: req.body.name,
    calories: req.body.calories,
    price: req.body.price,
  };

  if (req.file) {
    const { url, fileId } = await imageService.uploadImage(req.file, 'cup-ingredients');
    data.image = url;
    data.imageId = fileId;
  }

  const ingredient = await ingredientService.create(req.ingredientType, data);

  sendSuccess(res, 'Ingredient created successfully', { ingredient }, 201);
});

// @desc    Update an ingredient
// @route   PUT /api/v1/admin/ingredients/:type/:id
// @access  Private (Admin/Super Admin)
exports.updateIngredient = asyncHandler(async (req, res, next) => {
  const data = {};
  if (req.body.name !== undefined) data.name = req.body.name;
  if (req.body.calories !== undefined) data.calories = req.body.calories;
  if (req.body.price !== undefined) data.price = req.body.price;

  if (req.file) {
    const existing = await ingredientService.findById(req.ingredientType, req.params.id);
    const { url, fileId } = await imageService.updateImage(
      existing.imageId,
      req.file,
      'cup-ingredients'
    );
    data.image = url;
    data.imageId = fileId;
  }

  const ingredient = await ingredientService.update(req.ingredientType, req.params.id, data);

  sendSuccess(res, 'Ingredient updated successfully', { ingredient });
});

// @desc    Delete an ingredient
// @route   DELETE /api/v1/admin/ingredients/:type/:id
// @access  Private (Admin/Super Admin)
exports.deleteIngredient = asyncHandler(async (req, res, next) => {
  const ingredient = await ingredientService.findById(req.ingredientType, req.params.id);

  if (ingredient.imageId) {
    await imageService.deleteImage(ingredient.imageId);
  }

  await ingredientService.delete(req.ingredientType, req.params.id);

  sendSuccess(res, 'Ingredient deleted successfully');
});

// @desc    Get all ingredients of a type
// @route   GET /api/v1/admin/ingredients/:type
// @access  Private (Admin/Super Admin)
exports.getAllIngredients = asyncHandler(async (req, res, next) => {
  const ingredients = await ingredientService.findAll(req.ingredientType);
  sendSuccess(res, 'Ingredients retrieved successfully', { ingredients });
});

// @desc    Get single ingredient
// @route   GET /api/v1/admin/ingredients/:type/:id
// @access  Private (Admin/Super Admin)
exports.getIngredientById = asyncHandler(async (req, res, next) => {
  const ingredient = await ingredientService.findById(req.ingredientType, req.params.id);
  sendSuccess(res, 'Ingredient retrieved successfully', { ingredient });
});
