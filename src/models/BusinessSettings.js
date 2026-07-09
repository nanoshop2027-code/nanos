const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    amount: { type: Number, default: 0, min: [0, 'Amount cannot be negative'] },
  },
  { _id: false }
);

const businessSettingsSchema = new mongoose.Schema(
  {
    deliveryFee: { type: feeSchema, default: () => ({}) },
    packagingFee: { type: feeSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

businessSettingsSchema.statics.getSettings = async function () {
  return this.findOneAndUpdate(
    {},
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema);

module.exports = BusinessSettings;
