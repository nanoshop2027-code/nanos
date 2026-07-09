const ingredientService = require('./ingredientService');
const pricingService = require('./pricingService');

class CustomCupService {
  async preview({ bases, chocolateSauces = [], nuts = [], extras = [] }) {
    const allIds = [...bases, ...chocolateSauces, ...nuts, ...extras];
    const ingredientDocs = await ingredientService.findManyByIds(allIds);
    const { totalPrice, totalCalories, snapshot } = pricingService.computeIngredientsTotals(ingredientDocs);

    return {
      ingredients: snapshot,
      totalCalories,
      originalPrice: totalPrice,
      discountPercentage: 0,
      finalPrice: totalPrice,
    };
  }
}

module.exports = new CustomCupService();
