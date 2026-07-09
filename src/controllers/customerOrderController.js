const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Checkout (create an order)
// @route   POST /api/v1/customer/checkout
// @access  Private
exports.checkout = asyncHandler(async (req, res, next) => {
  const order = await orderService.checkout(req.user, req.body);
  sendSuccess(res, 'Order placed successfully', { order }, 201);
});

// @desc    Get my orders
// @route   GET /api/v1/customer/orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const { orders, pagination } = await orderService.listForUser(req.user._id, req.query);
  sendSuccess(res, 'Orders retrieved successfully', { orders, pagination });
});

// @desc    Get my order details
// @route   GET /api/v1/customer/orders/:id
// @access  Private
exports.getMyOrderById = asyncHandler(async (req, res, next) => {
  const order = await orderService.findByIdScoped(req.params.id, { userId: req.user._id, isAdmin: false });
  sendSuccess(res, 'Order retrieved successfully', { order });
});
