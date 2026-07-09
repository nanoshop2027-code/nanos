const cupService = require('../services/cupService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const imageService = require('../services/imageService');

// @desc    Create a menu cup
// @route   POST /api/v1/admin/cups
// @access  Private (Admin/Super Admin)
exports.createCup = asyncHandler(async (req, res, next) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    bases: req.body.bases,
    chocolateSauces: req.body.chocolateSauces,
    nuts: req.body.nuts,
    extras: req.body.extras,
    originalPrice: req.body.originalPrice,
    discountPercentage: req.body.discountPercentage,
  };

  if (req.file) {
    const { url, fileId } = await imageService.uploadImage(req.file, 'cups-menu');
    data.image = url;
    data.imageId = fileId;
  }

  const cup = await cupService.create(data);

  sendSuccess(res, 'Cup created successfully', { cup }, 201);
});

// @desc    Update a menu cup
// @route   PUT /api/v1/admin/cups/:id
// @access  Private (Admin/Super Admin)
exports.updateCup = asyncHandler(async (req, res, next) => {
  const data = {};
  [
    'name',
    'description',
    'category',
    'bases',
    'chocolateSauces',
    'nuts',
    'extras',
    'originalPrice',
    'discountPercentage',
  ].forEach((field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  });

  if (req.file) {
    const existing = await cupService.findRawById(req.params.id);
    const { url, fileId } = await imageService.updateImage(existing.imageId, req.file, 'cups-menu');
    data.image = url;
    data.imageId = fileId;
  }

  const cup = await cupService.update(req.params.id, data);

  sendSuccess(res, 'Cup updated successfully', { cup });
});

// @desc    Delete a menu cup
// @route   DELETE /api/v1/admin/cups/:id
// @access  Private (Admin/Super Admin)
exports.deleteCup = asyncHandler(async (req, res, next) => {
  const cup = await cupService.findRawById(req.params.id);

  if (cup.imageId) {
    await imageService.deleteImage(cup.imageId);
  }

  await cupService.delete(req.params.id);

  sendSuccess(res, 'Cup deleted successfully');
});

// @desc    Get all menu cups
// @route   GET /api/v1/admin/cups
// @access  Private (Admin/Super Admin)
exports.getAllCups = asyncHandler(async (req, res, next) => {
  const { cups, pagination } = await cupService.findAll(req.query);
  sendSuccess(res, 'Cups retrieved successfully', { cups, pagination });
});

// @desc    Get a menu cup with full details
// @route   GET /api/v1/admin/cups/:id
// @access  Private (Admin/Super Admin)
exports.getCupById = asyncHandler(async (req, res, next) => {
  const cup = await cupService.findById(req.params.id);
  sendSuccess(res, 'Cup retrieved successfully', { cup });
});
