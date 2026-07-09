const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const orderStatusValidation = require('../validators/orderStatusValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Orders
 *   description: Admin order management
 */

/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, out_for_delivery, delivered, cancelled]
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/', protect, restrictTo('admin', 'super-admin'), adminOrderController.getAllOrders);

/**
 * @swagger
 * /api/v1/admin/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get('/:id', protect, restrictTo('admin', 'super-admin'), adminOrderController.getOrderById);

/**
 * @swagger
 * /api/v1/admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, out_for_delivery, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.patch(
  '/:id/status',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(orderStatusValidation.updateStatus),
  adminOrderController.updateOrderStatus
);

module.exports = router;
