const BusinessSettings = require('../models/BusinessSettings');

class BusinessSettingsService {
  async getSettings() {
    return BusinessSettings.getSettings();
  }

  async updateSettings(data) {
    const settings = await BusinessSettings.getSettings();

    if (data.deliveryFee) {
      if (data.deliveryFee.enabled !== undefined) settings.deliveryFee.enabled = data.deliveryFee.enabled;
      if (data.deliveryFee.amount !== undefined) settings.deliveryFee.amount = data.deliveryFee.amount;
    }

    if (data.packagingFee) {
      if (data.packagingFee.enabled !== undefined) settings.packagingFee.enabled = data.packagingFee.enabled;
      if (data.packagingFee.amount !== undefined) settings.packagingFee.amount = data.packagingFee.amount;
    }

    await settings.save();
    return settings;
  }
}

module.exports = new BusinessSettingsService();
