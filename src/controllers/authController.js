const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Check if user already exists
  const query = {};
  if (email) query.email = email;
  if (phone) query.phone = phone;

  const existingUser = await User.findOne({
    $or: [
      email ? { email } : {},
      phone ? { phone } : {}
    ].filter(obj => Object.keys(obj).length > 0)
  });

  if (existingUser) {
    return next(new AppError('User already exists with this email or phone', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
  });

  // Generate tokens
  const { accessToken, refreshToken } = tokenService.generateTokenPair(user._id);
  await tokenService.saveRefreshToken(user._id, refreshToken);

  // Send welcome email if email is provided
  if (email) {
    try {
      await emailService.sendWelcomeEmail(email, firstName);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  sendSuccess(res, 'User registered successfully', {
    user,
    accessToken,
    refreshToken,
  }, 201);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;

  // Find user by email or phone
  const query = {};
  if (email) query.email = email;
  if (phone) query.phone = phone;

  const user = await User.findOne(query).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  // Generate tokens
  const { accessToken, refreshToken } = tokenService.generateTokenPair(user._id);
  await tokenService.saveRefreshToken(user._id, refreshToken);

  // Remove password from output
  user.password = undefined;

  sendSuccess(res, 'Logged in successfully', {
    user,
    accessToken,
    refreshToken,
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, phone } = req.body;

  // Find user
  const query = {};
  if (email) query.email = email;
  if (phone) query.phone = phone;

  const user = await User.findOne(query);

  if (!user) {
    return next(new AppError('No user found with this email or phone', 404));
  }

  // Check if user has email
  if (!user.email) {
    return next(new AppError('User does not have an email address registered', 400));
  }

  // Generate reset token
  const resetToken = tokenService.generateResetPasswordToken(user._id);

  // Save reset token to database
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  // Send email
  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken);
    sendSuccess(res, 'Password reset link sent to your email');
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Failed to send email. Please try again later', 500));
  }
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;

  // Verify token
  let decoded;
  try {
    decoded = tokenService.verifyResetPasswordToken(token);
  } catch (error) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  // Find user
  const user = await User.findOne({
    _id: decoded.id,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Revoke all refresh tokens
  await tokenService.revokeAllUserTokens(user._id);

  sendSuccess(res, 'Password reset successfully. Please log in with your new password');
});

// @desc    Change password
// @route   POST /api/v1/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Revoke all refresh tokens
  await tokenService.revokeAllUserTokens(user._id);

  // Generate new tokens
  const { accessToken, refreshToken } = tokenService.generateTokenPair(user._id);
  await tokenService.saveRefreshToken(user._id, refreshToken);

  sendSuccess(res, 'Password changed successfully', {
    accessToken,
    refreshToken,
  });
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  let tokenData;
  try {
    tokenData = await tokenService.verifyRefreshToken(refreshToken);
  } catch (error) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = 
    tokenService.generateTokenPair(tokenData.user._id);

  // Revoke old refresh token
  await tokenService.revokeRefreshToken(refreshToken);

  // Save new refresh token
  await tokenService.saveRefreshToken(tokenData.user._id, newRefreshToken);

  sendSuccess(res, 'Token refreshed successfully', {
    accessToken,
    refreshToken: newRefreshToken,
  });
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
  }

  sendSuccess(res, 'Logged out successfully');
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 'User retrieved successfully', { user });
});
