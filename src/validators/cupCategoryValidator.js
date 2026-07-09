const Joi = require('joi');

const cupCategoryValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name cannot exceed 50 characters',
      'any.required': 'Category name is required',
    }),
    description: Joi.string().max(500).allow('').messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(50).messages({
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name cannot exceed 50 characters',
    }),
    description: Joi.string().max(500).allow('').messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  }).min(1),
};

module.exports = cupCategoryValidation;
