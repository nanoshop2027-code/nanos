const Joi = require('joi');

const feeSchema = Joi.object({
  enabled: Joi.boolean(),
  amount: Joi.number().min(0).messages({
    'number.min': 'Amount cannot be negative',
  }),
});

const businessSettingsValidation = {
  update: Joi.object({
    deliveryFee: feeSchema,
    packagingFee: feeSchema,
  }).min(1),
};

module.exports = businessSettingsValidation;
