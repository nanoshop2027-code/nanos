const express = require('express');
const router = express.Router();
const customerSettingsController = require('../controllers/customerSettingsController');

/**
 * @swagger
 * tags:
 *   name: Customer - Business Settings
 *   description: Public business settings (delivery/packaging fees)
 */

/**
 * @swagger
 * /api/v1/customer/settings:
 *   get:
 *     summary: Get business settings
 *     tags: [Customer - Business Settings]
 *     responses:
 *       200:
 *         description: Business settings retrieved successfully
 */
router.get('/', customerSettingsController.getSettings);

module.exports = router;
