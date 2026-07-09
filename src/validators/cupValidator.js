const Joi = require('joi');
const { objectId } = require('./common');

const idArray = Joi.array().items(objectId);

const cupValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'any.required': 'Cup name is required',
    }),
    description: Joi.string().max(1000).allow(''),
    category: objectId.required().messages({
      'any.required': 'Cup category is required',
    }),
    bases: idArray.min(1).required().messages({
      'array.min': 'At least one cup base is required',
      'any.required': 'At least one cup base is required',
    }),
    chocolateSauces: idArray,
    nuts: idArray,
    extras: idArray,
    originalPrice: Joi.number().min(0).messages({
      'number.min': 'Original price cannot be negative',
    }),
    discountPercentage: Joi.number().min(0).max(100).messages({
      'number.min': 'Discount percentage cannot be negative',
      'number.max': 'Discount percentage cannot exceed 100',
    }),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(1000).allow(''),
    category: objectId,
    bases: idArray.min(1).messages({
      'array.min': 'At least one cup base is required',
    }),
    chocolateSauces: idArray,
    nuts: idArray,
    extras: idArray,
    originalPrice: Joi.number().min(0),
    discountPercentage: Joi.number().min(0).max(100),
  }).min(1),
};

module.exports = cupValidation;
