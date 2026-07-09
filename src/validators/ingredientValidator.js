const Joi = require('joi');

const ingredientValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Ingredient name must be at least 2 characters',
      'string.max': 'Ingredient name cannot exceed 50 characters',
      'any.required': 'Ingredient name is required',
    }),
    calories: Joi.number().min(0).required().messages({
      'number.base': 'Calories must be a number',
      'number.min': 'Calories cannot be negative',
      'any.required': 'Calories is required',
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required',
    }),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(50).messages({
      'string.min': 'Ingredient name must be at least 2 characters',
      'string.max': 'Ingredient name cannot exceed 50 characters',
    }),
    calories: Joi.number().min(0).messages({
      'number.base': 'Calories must be a number',
      'number.min': 'Calories cannot be negative',
    }),
    price: Joi.number().min(0).messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
    }),
  }).min(1),
};

module.exports = ingredientValidation;
