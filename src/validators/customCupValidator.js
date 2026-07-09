const Joi = require('joi');
const { objectId } = require('./common');

const idArray = Joi.array().items(objectId);

const customCupValidation = {
  preview: Joi.object({
    bases: idArray.min(1).required().messages({
      'array.min': 'At least one cup base is required',
      'any.required': 'At least one cup base is required',
    }),
    chocolateSauces: idArray,
    nuts: idArray,
    extras: idArray,
  }),
};

module.exports = customCupValidation;
