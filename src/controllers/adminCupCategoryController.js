const cupCategoryService = require('../services/cupCategoryService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const imageService = require('../services/imageService');

// @desc    Create cup category
// @route   POST /api/v1/admin/categories
// @access  Private (Admin/Super Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
  const data = { name: req.body.name, description: req.body.description };

  if (req.file) {
    const { url, fileId } = await imageService.uploadImage(req.file, 'cup-categories');
    data.image = url;
    data.imageId = fileId;
  }

  const category = await cupCategoryService.create(data);

  sendSuccess(res, 'Cup category created successfully', { category }, 201);
});

// @desc    Update cup category
// @route   PUT /api/v1/admin/categories/:id
// @access  Private (Admin/Super Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const data = {};
  if (req.body.name !== undefined) data.name = req.body.name;
  if (req.body.description !== undefined) data.description = req.body.description;

  if (req.file) {
    const category = await cupCategoryService.findById(req.params.id);
    const { url, fileId } = await imageService.updateImage(
      category.imageId,
      req.file,
      'cup-categories'
    );
    data.image = url;
    data.imageId = fileId;
  }

  const category = await cupCategoryService.update(req.params.id, data);

  sendSuccess(res, 'Cup category updated successfully', { category });
});

// @desc    Delete cup category
// @route   DELETE /api/v1/admin/categories/:id
// @access  Private (Admin/Super Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await cupCategoryService.findById(req.params.id);

  if (category.imageId) {
    await imageService.deleteImage(category.imageId);
  }

  await cupCategoryService.delete(req.params.id);

  sendSuccess(res, 'Cup category deleted successfully');
});

// @desc    Get all cup categories
// @route   GET /api/v1/admin/categories
// @access  Private (Admin/Super Admin)
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await cupCategoryService.findAll();
  sendSuccess(res, 'Cup categories retrieved successfully', { categories });
});

// @desc    Get single cup category
// @route   GET /api/v1/admin/categories/:id
// @access  Private (Admin/Super Admin)
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await cupCategoryService.findById(req.params.id);
  sendSuccess(res, 'Cup category retrieved successfully', { category });
});
