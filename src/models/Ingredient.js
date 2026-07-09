const mongoose = require('mongoose');

const INGREDIENT_TYPES = ['base', 'chocolate_sauce', 'nut', 'extra'];

const ingredientSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: INGREDIENT_TYPES,
      required: [true, 'Ingredient type is required'],
    },
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      minlength: [2, 'Ingredient name must be at least 2 characters'],
      maxlength: [50, 'Ingredient name cannot exceed 50 characters'],
    },
    image: {
      type: String,
      default: null,
    },
    imageId: {
      type: String,
      default: null,
    },
    calories: {
      type: Number,
      required: [true, 'Calories is required'],
      min: [0, 'Calories cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

ingredientSchema.index({ type: 1, name: 1 });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
module.exports.INGREDIENT_TYPES = INGREDIENT_TYPES;
