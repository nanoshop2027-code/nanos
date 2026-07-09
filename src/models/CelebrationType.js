const mongoose = require('mongoose');

const celebrationTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Celebration type name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
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

const CelebrationType = mongoose.model('CelebrationType', celebrationTypeSchema);

module.exports = CelebrationType;
