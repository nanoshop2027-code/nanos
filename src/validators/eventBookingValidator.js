const Joi = require('joi');
const { objectId } = require('./common');
const { GUEST_RANGES, EVENT_STATUSES } = require('../models/EventBooking');

const eventBookingValidation = {
  create: Joi.object({
    celebrationTypeId: objectId.messages({
      'string.pattern.base': 'celebrationTypeId must be a valid ID',
    }),
    customCelebrationType: Joi.string().trim().min(2).max(100).messages({
      'string.min': 'Custom celebration type must be at least 2 characters',
      'string.max': 'Custom celebration type cannot exceed 100 characters',
    }),
    eventDate: Joi.date().iso().min('now').required().messages({
      'date.base': 'Please provide a valid event date',
      'date.min': 'Event date cannot be in the past',
      'any.required': 'Event date is required',
    }),
    guestsRange: Joi.string()
      .valid(...GUEST_RANGES)
      .required()
      .messages({
        'any.only': `Guests range must be one of: ${GUEST_RANGES.join(', ')}`,
        'any.required': 'Guests range is required',
      }),
    fullName: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Full name must be at least 2 characters',
      'any.required': 'Full name is required',
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
        'any.required': 'Phone number is required',
      }),
    city: Joi.string().min(2).max(100).required().messages({
      'any.required': 'City is required',
    }),
    notes: Joi.string().max(1000).allow('').messages({
      'string.max': 'Additional notes cannot exceed 1000 characters',
    }),
  })
    .xor('celebrationTypeId', 'customCelebrationType')
    .messages({
      'object.xor': 'Provide either celebrationTypeId or customCelebrationType, not both',
      'object.missing': 'Provide either celebrationTypeId or customCelebrationType',
    }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(...EVENT_STATUSES)
      .required()
      .messages({
        'any.only': `Status must be one of: ${EVENT_STATUSES.join(', ')}`,
        'any.required': 'Status is required',
      }),
  }),

  updateActualGuests: Joi.object({
    actualNumberOfGuests: Joi.number().integer().min(1).required().messages({
      'number.min': 'Actual number of guests must be greater than zero',
      'any.required': 'Actual number of guests is required',
    }),
  }),

  updateInternalNotes: Joi.object({
    internalNotes: Joi.string().allow('').max(2000).required().messages({
      'string.max': 'Internal notes cannot exceed 2000 characters',
      'any.required': 'Internal notes is required',
    }),
  }),
};

module.exports = eventBookingValidation;
