const Contact = require('../models/Contact');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const emailService = require('../services/emailService');

// @desc    Submit contact form
// @route   POST /api/v1/contact
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  // Create contact submission
  const contact = await Contact.create({
    name,
    email,
    phone,
    message,
  });

  // Send confirmation email if email is provided
  if (email) {
    try {
      await emailService.sendContactConfirmation(email, name);
    } catch (error) {
      console.error('Failed to send contact confirmation email:', error);
    }
  }

  sendSuccess(res, 'Your message has been sent successfully. We will get back to you soon.', { contact }, 201);
});

// @desc    Get all contact submissions (Admin/Super Admin)
// @route   GET /api/v1/contact
// @access  Private (Admin/Super Admin)
exports.getAllContacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by read status
  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === 'true';
  }

  const contacts = await Contact.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Contact.countDocuments(filter);

  sendSuccess(res, 'Contact submissions retrieved successfully', {
    contacts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContacts: total,
      limit,
    },
  });
});

// @desc    Get single contact submission (Admin/Super Admin)
// @route   GET /api/v1/contact/:id
// @access  Private (Admin/Super Admin)
exports.getContactById = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError('Contact submission not found', 404));
  }

  // Mark as read
  if (!contact.isRead) {
    contact.isRead = true;
    await contact.save();
  }

  sendSuccess(res, 'Contact submission retrieved successfully', { contact });
});

// @desc    Delete contact submission (Admin/Super Admin)
// @route   DELETE /api/v1/contact/:id
// @access  Private (Admin/Super Admin)
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError('Contact submission not found', 404));
  }

  await contact.deleteOne();

  sendSuccess(res, 'Contact submission deleted successfully');
});
