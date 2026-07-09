const AppError = require('../utils/AppError');
const { SLUG_TO_TYPE } = require('../utils/ingredientTypes');

const mapIngredientType = (req, res, next) => {
  const type = SLUG_TO_TYPE[req.params.type];

  if (!type) {
    return next(new AppError(`Unknown ingredient type '${req.params.type}'`, 404));
  }

  req.ingredientType = type;
  next();
};

module.exports = mapIngredientType;
