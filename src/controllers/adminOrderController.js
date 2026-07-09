const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get all orders
// @route   GET /api/v1/admin/orders
// @access  Private (Admin/Super Admin)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const { orders, pagination } = await orderService.listForAdmin(req.query);
  sendSuccess(res, 'Orders retrieved successfully', { orders, pagination });
});

// @desc    Get an order by ID
// @route   GET /api/v1/admin/orders/:id
// @access  Private (Admin/Super Admin)
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await orderService.findByIdScoped(req.params.id, { isAdmin: true });
  sendSuccess(res, 'Order retrieved successfully', { order });
});

// @desc    Update order status
// @route   PATCH /api/v1/admin/orders/:id/status
// @access  Private (Admin/Super Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);
  sendSuccess(res, 'Order status updated successfully', { order });
});
