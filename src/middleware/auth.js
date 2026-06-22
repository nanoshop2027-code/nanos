const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/config');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to access this route', 401)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.accessSecret);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again', 401));
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
