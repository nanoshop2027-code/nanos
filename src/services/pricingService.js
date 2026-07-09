const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

class PricingService {
  computeIngredientsTotals(ingredientDocs) {
    const totals = ingredientDocs.reduce(
      (acc, ingredient) => {
        acc.totalPrice += ingredient.price;
        acc.totalCalories += ingredient.calories;
        acc.snapshot.push({
          name: ingredient.name,
          type: ingredient.type,
          image: ingredient.image || null,
          calories: ingredient.calories,
          price: ingredient.price,
        });
        return acc;
      },
      { totalPrice: 0, totalCalories: 0, snapshot: [] }
    );

    totals.totalPrice = round2(totals.totalPrice);

    return totals;
  }

  applyDiscount(originalPrice, discountPercentage) {
    const discount = (originalPrice * discountPercentage) / 100;
    return round2(originalPrice - discount);
  }

  round(value) {
    return round2(value);
  }
}

module.exports = new PricingService();
