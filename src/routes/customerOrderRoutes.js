const express = require('express');
const router = express.Router();
const customerOrderController = require('../controllers/customerOrderController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Customer - Orders
 *   description: Checkout and order history
 */

/**
 * @swagger
 * /api/v1/customer/orders:
 *   get:
 *     summary: Get my orders
 *     tags: [Customer - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       401:
 *         description: Not authenticated
 */
router.get('/', protect, customerOrderController.getMyOrders);

/**
 * @swagger
 * /api/v1/customer/orders/{id}:
 *   get:
 *     summary: Get my order details
 *     tags: [Customer - Orders]
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
router.get('/:id', protect, customerOrderController.getMyOrderById);

module.exports = router;
