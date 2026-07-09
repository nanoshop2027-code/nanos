const CelebrationType = require('../models/CelebrationType');
const AppError = require('../utils/AppError');

class CelebrationTypeService {
  async create(data) {
    return CelebrationType.create(data);
  }

  async update(id, data) {
    const celebrationType = await CelebrationType.findById(id);
    if (!celebrationType) {
      throw new AppError('Celebration type not found', 404);
    }

    Object.assign(celebrationType, data);
    await celebrationType.save();
    return celebrationType;
  }

  async delete(id) {
    const celebrationType = await CelebrationType.findById(id);
    if (!celebrationType) {
      throw new AppError('Celebration type not found', 404);
    }

    await celebrationType.deleteOne();
    return celebrationType;
  }

  async findAll() {
    return CelebrationType.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    const celebrationType = await CelebrationType.findById(id);
    if (!celebrationType) {
      throw new AppError('Celebration type not found', 404);
    }
    return celebrationType;
  }
}

module.exports = new CelebrationTypeService();
