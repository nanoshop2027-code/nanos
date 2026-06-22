const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const emailService = require('../services/emailService');

// @desc    Create admin (Super Admin only)
// @route   POST /api/v1/admin/create-admin
// @access  Private (Super Admin only)
exports.createAdmin = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      email ? { email } : {},
      phone ? { phone } : {}
    ].filter(obj => Object.keys(obj).length > 0)
  });

  if (existingUser) {
    return next(new AppError('User already exists with this email or phone', 400));
  }

  // Create admin user
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: 'admin',
  });

  // Send email if email is provided
  if (email) {
    try {
      await emailService.sendAdminCreatedEmail(email, firstName, password);
    } catch (error) {
      console.error('Failed to send admin created email:', error);
    }
  }

  sendSuccess(res, 'Admin created successfully', { admin }, 201);
});

// @desc    Get all users (Admin/Super Admin)
// @route   GET /api/v1/admin/users
// @access  Private (Admin/Super Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  
  // Filter by role
  if (req.query.role) {
    filter.role = req.query.role;
  }

  // Filter by active status
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const users = await User.find(filter)
    .select('-password')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  sendSuccess(res, 'Users retrieved successfully', {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      limit,
    },
  });
});

// @desc    Get single user (Admin/Super Admin)
// @route   GET /api/v1/admin/users/:id
// @access  Private (Admin/Super Admin)
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  sendSuccess(res, 'User retrieved successfully', { user });
});

// @desc    Update user (Admin/Super Admin)
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin/Super Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phone, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent modifying super admin
  if (user.role === 'super-admin' && req.user.role !== 'super-admin') {
    return next(new AppError('You cannot modify a super admin account', 403));
  }

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  sendSuccess(res, 'User updated successfully', { user });
});

// @desc    Delete user (Admin/Super Admin)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin/Super Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent deleting super admin
  if (user.role === 'super-admin') {
    return next(new AppError('Cannot delete super admin account', 403));
  }

  await user.deleteOne();

  sendSuccess(res, 'User deleted successfully');
});
