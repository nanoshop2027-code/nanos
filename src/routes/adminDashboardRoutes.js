const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin - Dashboard
 *   description: Admin dashboard statistics
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: integer
 *                         totalRevenue:
 *                           type: number
 *                         totalUsers:
 *                           type: integer
 *                         totalMenuCups:
 *                           type: integer
 *                         pendingOrders:
 *                           type: integer
 */
router.get('/', protect, restrictTo('admin', 'super-admin'), adminDashboardController.getStats);

module.exports = router;
