const express = require('express');
const router = express.Router();
const adminSettingsController = require('../controllers/adminSettingsController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const businessSettingsValidation = require('../validators/businessSettingsValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Business Settings
 *   description: Admin management of delivery/packaging fee settings
 */

/**
 * @swagger
 * /api/v1/admin/settings:
 *   get:
 *     summary: Get business settings
 *     tags: [Admin - Business Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business settings retrieved successfully
 */
router.get('/', protect, restrictTo('admin', 'super-admin'), adminSettingsController.getSettings);

/**
 * @swagger
 * /api/v1/admin/settings:
 *   put:
 *     summary: Update business settings
 *     tags: [Admin - Business Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryFee:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                   amount:
 *                     type: number
 *               packagingFee:
 *                 type: object
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                   amount:
 *                     type: number
 *     responses:
 *       200:
 *         description: Business settings updated successfully
 *       400:
 *         description: Validation error
 */
router.put(
  '/',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(businessSettingsValidation.update),
  adminSettingsController.updateSettings
);

module.exports = router;
