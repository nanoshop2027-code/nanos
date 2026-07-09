const CupCategory = require('../models/CupCategory');
const AppError = require('../utils/AppError');

class CupCategoryService {
  async create(data) {
    return CupCategory.create(data);
  }

  async update(id, data) {
    const category = await CupCategory.findById(id);
    if (!category) {
      throw new AppError('Cup category not found', 404);
    }

    Object.assign(category, data);
    await category.save();
    return category;
  }

  async delete(id) {
    const category = await CupCategory.findById(id);
    if (!category) {
      throw new AppError('Cup category not found', 404);
    }

    await category.deleteOne();
    return category;
  }

  async findAll() {
    return CupCategory.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    const category = await CupCategory.findById(id);
    if (!category) {
      throw new AppError('Cup category not found', 404);
    }
    return category;
  }
}

module.exports = new CupCategoryService();
