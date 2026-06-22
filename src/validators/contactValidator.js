const Joi = require('joi');

const contactValidation = {
  createContact: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email',
    }),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).messages({
      'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
    }),
    message: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Message must be at least 10 characters',
      'string.max': 'Message cannot exceed 1000 characters',
      'any.required': 'Message is required',
    }),
  }).or('email', 'phone').messages({
    'object.missing': 'Either email or phone must be provided',
  }),
};

module.exports = contactValidation;
