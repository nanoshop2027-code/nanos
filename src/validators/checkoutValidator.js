const Joi = require('joi');
const { objectId } = require('./common');

const idArray = Joi.array().items(objectId);

const itemSchema = Joi.object({
  itemType: Joi.string().valid('menu', 'custom').required().messages({
    'any.only': 'itemType must be either "menu" or "custom"',
    'any.required': 'itemType is required',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': 'Quantity must be greater than zero',
    'any.required': 'Quantity is required',
  }),
  cupId: Joi.when('itemType', {
    is: 'menu',
    then: objectId.required().messages({ 'any.required': 'cupId is required for menu items' }),
    otherwise: Joi.forbidden(),
  }),
  bases: Joi.when('itemType', {
    is: 'custom',
    then: idArray.min(1).required().messages({
      'array.min': 'A custom cup must contain at least one cup base',
      'any.required': 'A custom cup must contain at least one cup base',
    }),
    otherwise: Joi.forbidden(),
  }),
  chocolateSauces: Joi.when('itemType', { is: 'custom', then: idArray, otherwise: Joi.forbidden() }),
  nuts: Joi.when('itemType', { is: 'custom', then: idArray, otherwise: Joi.forbidden() }),
  extras: Joi.when('itemType', { is: 'custom', then: idArray, otherwise: Joi.forbidden() }),
});

const checkoutValidation = {
  checkout: Joi.object({
    items: Joi.array().items(itemSchema).min(1).required().messages({
      'array.min': 'At least one item is required',
      'any.required': 'At least one item is required',
    }),
    deliveryInfo: Joi.object({
      fullName: Joi.string().min(2).max(100).required().messages({
        'any.required': 'Full name is required',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
      }),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
        'any.required': 'Phone number is required',
      }),
      address: Joi.string().min(5).required().messages({
        'any.required': 'Delivery address is required',
      }),
      city: Joi.string().required().messages({
        'any.required': 'City is required',
      }),
      postalCode: Joi.string().allow(''),
    }).required(),
    paymentMethod: Joi.string().valid('cash', 'card').required().messages({
      'any.only': 'paymentMethod must be either "cash" or "card"',
      'any.required': 'Payment method is required',
    }),
  }),
};

module.exports = checkoutValidation;
