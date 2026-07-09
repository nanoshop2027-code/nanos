const Cup = require('../models/Cup');
const CupCategory = require('../models/CupCategory');
const AppError = require('../utils/AppError');
const ingredientService = require('./ingredientService');
const pricingService = require('./pricingService');

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  price_asc: { priceAfterDiscount: 1 },
  price_desc: { priceAfterDiscount: -1 },
  calories_asc: { totalCalories: 1 },
  calories_desc: { totalCalories: -1 },
};

const POPULATE_FIELDS = 'name image imageId price calories type';

class CupService {
  async _resolvePricing({ bases, chocolateSauces, nuts, extras, originalPrice, discountPercentage }) {
    const allIds = [
      ...bases,
      ...(chocolateSauces || []),
      ...(nuts || []),
      ...(extras || []),
    ];
    const ingredientDocs = await ingredientService.findManyByIds(allIds);
    const { totalPrice, totalCalories } = pricingService.computeIngredientsTotals(ingredientDocs);

    const isManualPrice = originalPrice !== undefined && originalPrice !== null;
    const finalOriginalPrice = isManualPrice ? originalPrice : totalPrice;
    const finalDiscount = discountPercentage || 0;
    const priceAfterDiscount = pricingService.applyDiscount(finalOriginalPrice, finalDiscount);

    return {
      isManualPrice,
      originalPrice: finalOriginalPrice,
      discountPercentage: finalDiscount,
      priceAfterDiscount,
      totalCalories,
    };
  }

  async create(data) {
    await this._assertCategoryExists(data.category);

    const pricingFields = await this._resolvePricing(data);

    return Cup.create({
      name: data.name,
      description: data.description,
      image: data.image,
      imageId: data.imageId,
      category: data.category,
      bases: data.bases,
      chocolateSauces: data.chocolateSauces || [],
      nuts: data.nuts || [],
      extras: data.extras || [],
      ...pricingFields,
    });
  }

  async update(id, data) {
    const cup = await this.findRawById(id);

    if (data.category) {
      await this._assertCategoryExists(data.category);
      cup.category = data.category;
    }

    const bases = data.bases !== undefined ? data.bases : cup.bases;
    const chocolateSauces = data.chocolateSauces !== undefined ? data.chocolateSauces : cup.chocolateSauces;
    const nuts = data.nuts !== undefined ? data.nuts : cup.nuts;
    const extras = data.extras !== undefined ? data.extras : cup.extras;
    const discountPercentage = data.discountPercentage !== undefined ? data.discountPercentage : cup.discountPercentage;
    const originalPrice = data.originalPrice !== undefined ? data.originalPrice : undefined;

    const pricingFields = await this._resolvePricing({
      bases,
      chocolateSauces,
      nuts,
      extras,
      originalPrice,
      discountPercentage,
    });

    if (data.name !== undefined) cup.name = data.name;
    if (data.description !== undefined) cup.description = data.description;
    if (data.image !== undefined) cup.image = data.image;
    if (data.imageId !== undefined) cup.imageId = data.imageId;
    cup.bases = bases;
    cup.chocolateSauces = chocolateSauces;
    cup.nuts = nuts;
    cup.extras = extras;
    Object.assign(cup, pricingFields);

    await cup.save();
    return cup;
  }

  async delete(id) {
    const cup = await this.findRawById(id);
    await cup.deleteOne();
    return cup;
  }

  async findAll(query = {}) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minCalories,
      maxCalories,
      sort,
      page = 1,
      limit = 10,
    } = query;

    const filter = {};
    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.priceAfterDiscount = {};
      if (minPrice) filter.priceAfterDiscount.$gte = Number(minPrice);
      if (maxPrice) filter.priceAfterDiscount.$lte = Number(maxPrice);
    }

    if (minCalories || maxCalories) {
      filter.totalCalories = {};
      if (minCalories) filter.totalCalories.$gte = Number(minCalories);
      if (maxCalories) filter.totalCalories.$lte = Number(maxCalories);
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      const matchingCategories = await CupCategory.find({ name: regex }).select('_id');
      const categoryIds = matchingCategories.map((cat) => cat._id);
      filter.$or = [{ name: regex }, { description: regex }, { category: { $in: categoryIds } }];
    }

    const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [cups, total] = await Promise.all([
      Cup.find(filter)
        .populate('category', 'name image')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum),
      Cup.countDocuments(filter),
    ]);

    return {
      cups,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  async findById(id) {
    const cup = await Cup.findById(id)
      .populate('category', 'name image')
      .populate('bases', POPULATE_FIELDS)
      .populate('chocolateSauces', POPULATE_FIELDS)
      .populate('nuts', POPULATE_FIELDS)
      .populate('extras', POPULATE_FIELDS);

    if (!cup) {
      throw new AppError('Cup not found', 404);
    }

    return cup;
  }

  async findRawById(id) {
    const cup = await Cup.findById(id);
    if (!cup) {
      throw new AppError('Cup not found', 404);
    }
    return cup;
  }

  async _assertCategoryExists(categoryId) {
    const category = await CupCategory.findById(categoryId);
    if (!category) {
      throw new AppError('Cup category not found', 404);
    }
  }
}

module.exports = new CupService();
