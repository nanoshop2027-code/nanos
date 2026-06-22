const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const imageService = require('../services/imageService');

// @desc    Upload profile image
// @route   POST /api/v1/users/profile-image
// @access  Private
exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  const user = await User.findById(req.user._id);

  // Delete old image if exists
  if (user.profileImageId) {
    await imageService.deleteImage(user.profileImageId);
  }

  // Upload new image
  const { url, fileId } = await imageService.uploadImage(req.file, 'profile-images');

  // Update user
  user.profileImage = url;
  user.profileImageId = fileId;
  await user.save();

  sendSuccess(res, 'Profile image uploaded successfully', {
    profileImage: url,
  });
});

// @desc    Update profile image
// @route   PUT /api/v1/users/profile-image
// @access  Private
exports.updateProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  const user = await User.findById(req.user._id);

  // Update image (deletes old one automatically)
  const { url, fileId } = await imageService.updateImage(
    user.profileImageId,
    req.file,
    'profile-images'
  );

  // Update user
  user.profileImage = url;
  user.profileImageId = fileId;
  await user.save();

  sendSuccess(res, 'Profile image updated successfully', {
    profileImage: url,
  });
});

// @desc    Delete profile image
// @route   DELETE /api/v1/users/profile-image
// @access  Private
exports.deleteProfileImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user.profileImageId) {
    return next(new AppError('No profile image to delete', 400));
  }

  // Delete image from ImageKit
  await imageService.deleteImage(user.profileImageId);

  // Update user
  user.profileImage = null;
  user.profileImageId = null;
  await user.save();

  sendSuccess(res, 'Profile image deleted successfully');
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;

  const user = await User.findById(req.user._id);

  // Update fields if provided
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  
  // Check if email or phone is being changed and already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }
    user.email = email;
  }

  if (phone && phone !== user.phone) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return next(new AppError('Phone already in use', 400));
    }
    user.phone = phone;
  }

  await user.save();

  sendSuccess(res, 'Profile updated successfully', { user });
});
