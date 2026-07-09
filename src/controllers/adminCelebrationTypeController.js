const celebrationTypeService = require('../services/celebrationTypeService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const imageService = require('../services/imageService');

// @desc    Create celebration type
// @route   POST /api/v1/admin/celebration-types
// @access  Private (Admin/Super Admin)
exports.createCelebrationType = asyncHandler(async (req, res, next) => {
  const data = { name: req.body.name };

  if (req.file) {
    const { url, fileId } = await imageService.uploadImage(req.file, 'celebration-types');
    data.image = url;
    data.imageId = fileId;
  }

  const celebrationType = await celebrationTypeService.create(data);

  sendSuccess(res, 'Celebration type created successfully', { celebrationType }, 201);
});

// @desc    Update celebration type
// @route   PUT /api/v1/admin/celebration-types/:id
// @access  Private (Admin/Super Admin)
exports.updateCelebrationType = asyncHandler(async (req, res, next) => {
  const data = {};
  if (req.body.name !== undefined) data.name = req.body.name;

  if (req.file) {
    const celebrationType = await celebrationTypeService.findById(req.params.id);
    const { url, fileId } = await imageService.updateImage(
      celebrationType.imageId,
      req.file,
      'celebration-types'
    );
    data.image = url;
    data.imageId = fileId;
  }

  const celebrationType = await celebrationTypeService.update(req.params.id, data);

  sendSuccess(res, 'Celebration type updated successfully', { celebrationType });
});

// @desc    Delete celebration type
// @route   DELETE /api/v1/admin/celebration-types/:id
// @access  Private (Admin/Super Admin)
exports.deleteCelebrationType = asyncHandler(async (req, res, next) => {
  const celebrationType = await celebrationTypeService.findById(req.params.id);

  if (celebrationType.imageId) {
    await imageService.deleteImage(celebrationType.imageId);
  }

  await celebrationTypeService.delete(req.params.id);

  sendSuccess(res, 'Celebration type deleted successfully');
});

// @desc    Get all celebration types
// @route   GET /api/v1/admin/celebration-types
// @access  Private (Admin/Super Admin)
exports.getAllCelebrationTypes = asyncHandler(async (req, res, next) => {
  const celebrationTypes = await celebrationTypeService.findAll();
  sendSuccess(res, 'Celebration types retrieved successfully', { celebrationTypes });
});

// @desc    Get single celebration type
// @route   GET /api/v1/admin/celebration-types/:id
// @access  Private (Admin/Super Admin)
exports.getCelebrationTypeById = asyncHandler(async (req, res, next) => {
  const celebrationType = await celebrationTypeService.findById(req.params.id);
  sendSuccess(res, 'Celebration type retrieved successfully', { celebrationType });
});
