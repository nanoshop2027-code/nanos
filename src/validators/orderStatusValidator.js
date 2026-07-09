const Joi = require('joi');
const { ORDER_STATUSES } = require('../models/Order');

const orderStatusValidation = {
  updateStatus: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .required()
      .messages({
        'any.only': `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
        'any.required': 'Status is required',
      }),
  }),
};

module.exports = orderStatusValidation;
