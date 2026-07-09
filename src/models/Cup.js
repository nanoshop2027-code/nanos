const mongoose = require('mongoose');

const cupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cup name is required'],
      trim: true,
      minlength: [2, 'Cup name must be at least 2 characters'],
      maxlength: [100, 'Cup name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      default: null,
    },
    imageId: {
      type: String,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CupCategory',
      required: [true, 'Cup category is required'],
    },
    bases: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one cup base is required',
      },
    },
    chocolateSauces: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
      default: [],
    },
    nuts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
      default: [],
    },
    extras: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
      default: [],
    },
    isManualPrice: {
      type: Boolean,
      default: false,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: [0, 'Original price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100'],
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      min: [0, 'Price after discount cannot be negative'],
    },
    totalCalories: {
      type: Number,
      required: true,
      min: [0, 'Total calories cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

cupSchema.index({ name: 'text', description: 'text' });

const Cup = mongoose.model('Cup', cupSchema);

module.exports = Cup;
