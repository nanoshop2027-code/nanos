const Ingredient = require('../models/Ingredient');
const AppError = require('../utils/AppError');

class IngredientService {
  async create(type, data) {
    return Ingredient.create({ ...data, type });
  }

  async update(type, id, data) {
    const ingredient = await Ingredient.findOne({ _id: id, type });
    if (!ingredient) {
      throw new AppError('Ingredient not found', 404);
    }

    Object.assign(ingredient, data);
    await ingredient.save();
    return ingredient;
  }

  async delete(type, id) {
    const ingredient = await Ingredient.findOne({ _id: id, type });
    if (!ingredient) {
      throw new AppError('Ingredient not found', 404);
    }

    await ingredient.deleteOne();
    return ingredient;
  }

  async findAll(type) {
    return Ingredient.find({ type }).sort({ createdAt: -1 });
  }

  async findById(type, id) {
    const ingredient = await Ingredient.findOne({ _id: id, type });
    if (!ingredient) {
      throw new AppError('Ingredient not found', 404);
    }
    return ingredient;
  }

  async findManyByIds(ids) {
    const ingredients = await Ingredient.find({ _id: { $in: ids } });

    if (ingredients.length !== new Set(ids.map(String)).size) {
      throw new AppError('One or more selected ingredients do not exist', 400);
    }

    return ingredients;
  }
}

module.exports = new IngredientService();
