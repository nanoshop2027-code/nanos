const Joi = require('joi');

const authValidation = {
  register: Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.base': 'First name must be a string',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.base': 'Last name must be a string',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required',
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email',
    }),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).messages({
      'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required',
      }),
  }).or('email', 'phone').messages({
    'object.missing': 'Either email or phone must be provided',
  }),

  login: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }).or('email', 'phone').messages({
    'object.missing': 'Either email or phone must be provided',
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  }).or('email', 'phone').messages({
    'object.missing': 'Either email or phone must be provided',
  }),

  resetPassword: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Reset token is required',
    }),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required',
      }),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required',
      }),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),

  createAdmin: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required(),
  }).or('email', 'phone').messages({
    'object.missing': 'Either email or phone must be provided',
  }),
};

module.exports = authValidation;
