const Order = require('../models/Order');
const Cup = require('../models/Cup');
const AppError = require('../utils/AppError');
const ingredientService = require('./ingredientService');
const pricingService = require('./pricingService');
const businessSettingsService = require('./businessSettingsService');

const ORDER_NUMBER_PREFIX = 'NNS';
const MAX_ORDER_NUMBER_ATTEMPTS = 5;

class OrderService {
  async checkout(user, payload) {
    if (payload.paymentMethod === 'card') {
      throw new AppError('Card payment is coming soon', 400);
    }

    const itemLines = await Promise.all(
      payload.items.map((item) =>
        item.itemType === 'menu' ? this._buildMenuItemLine(item) : this._buildCustomItemLine(item)
      )
    );

    const itemsSubtotal = pricingService.round(
      itemLines.reduce((sum, line) => sum + line.lineTotal, 0)
    );

    const settings = await businessSettingsService.getSettings();
    const fees = {
      deliveryFee: {
        enabled: settings.deliveryFee.enabled,
        amount: settings.deliveryFee.enabled ? settings.deliveryFee.amount : 0,
      },
      packagingFee: {
        enabled: settings.packagingFee.enabled,
        amount: settings.packagingFee.enabled ? settings.packagingFee.amount : 0,
      },
    };

    const totalAmount = pricingService.round(
      itemsSubtotal + fees.deliveryFee.amount + fees.packagingFee.amount
    );

    return this._createWithOrderNumber({
      user: user._id,
      items: itemLines,
      deliveryInfo: payload.deliveryInfo,
      paymentMethod: payload.paymentMethod,
      fees,
      itemsSubtotal,
      totalAmount,
    });
  }

  async _buildMenuItemLine(item) {
    const cup = await Cup.findById(item.cupId).populate('category', 'name');
    if (!cup) {
      throw new AppError(`Menu cup not found: ${item.cupId}`, 400);
    }

    const lineTotal = pricingService.round(cup.priceAfterDiscount * item.quantity);

    return {
      itemType: 'menu',
      quantity: item.quantity,
      name: cup.name,
      description: cup.description,
      image: cup.image,
      categoryName: cup.category ? cup.category.name : undefined,
      cupId: cup._id,
      originalPrice: cup.originalPrice,
      discountPercentage: cup.discountPercentage,
      finalPrice: cup.priceAfterDiscount,
      totalCalories: cup.totalCalories,
      lineTotal,
      ingredients: [],
    };
  }

  async _buildCustomItemLine(item) {
    const bases = item.bases || [];
    if (bases.length === 0) {
      throw new AppError('A custom cup must contain at least one cup base', 400);
    }

    const allIds = [...bases, ...(item.chocolateSauces || []), ...(item.nuts || []), ...(item.extras || [])];
    const ingredientDocs = await ingredientService.findManyByIds(allIds);
    const { totalPrice, totalCalories, snapshot } = pricingService.computeIngredientsTotals(ingredientDocs);

    const lineTotal = pricingService.round(totalPrice * item.quantity);

    return {
      itemType: 'custom',
      quantity: item.quantity,
      name: 'Custom Cup',
      image: null,
      originalPrice: totalPrice,
      discountPercentage: 0,
      finalPrice: totalPrice,
      totalCalories,
      lineTotal,
      ingredients: snapshot,
    };
  }

  async _createWithOrderNumber(orderData) {
    for (let attempt = 0; attempt < MAX_ORDER_NUMBER_ATTEMPTS; attempt += 1) {
      const orderNumber = await this._nextOrderNumber();
      try {
        return await Order.create({ ...orderData, orderNumber });
      } catch (err) {
        const isLastAttempt = attempt === MAX_ORDER_NUMBER_ATTEMPTS - 1;
        if (err.code === 11000 && !isLastAttempt) {
          continue;
        }
        throw err;
      }
    }
    throw new AppError('Failed to generate a unique order number, please try again', 500);
  }

  async _nextOrderNumber() {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const countToday = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    return `${ORDER_NUMBER_PREFIX}-${datePart}-${String(countToday + 1).padStart(5, '0')}`;
  }

  async listForAdmin({ status, user, page = 1, limit = 10 }) {
    const filter = {};
    if (status) filter.status = status;
    if (user) filter.user = user;

    return this._paginate(filter, page, limit);
  }

  async listForUser(userId, { page = 1, limit = 10 } = {}) {
    return this._paginate({ user: userId }, page, limit);
  }

  async _paginate(filter, page, limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  async findByIdScoped(id, { userId, isAdmin }) {
    const order = await Order.findById(id);
    if (!order || (!isAdmin && String(order.user) !== String(userId))) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }

  async updateStatus(id, status) {
    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    order.status = status;
    await order.save();
    return order;
  }
}

module.exports = new OrderService();
