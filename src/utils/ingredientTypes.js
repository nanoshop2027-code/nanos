const SLUG_TO_TYPE = {
  bases: 'base',
  'chocolate-sauces': 'chocolate_sauce',
  nuts: 'nut',
  extras: 'extra',
};

const TYPE_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_TYPE).map(([slug, type]) => [type, slug])
);

module.exports = { SLUG_TO_TYPE, TYPE_TO_SLUG };
