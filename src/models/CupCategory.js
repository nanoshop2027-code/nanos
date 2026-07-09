const mongoose = require('mongoose');

const cupCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: null,
    },
    imageId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CupCategory = mongoose.model('CupCategory', cupCategorySchema);

module.exports = CupCategory;
