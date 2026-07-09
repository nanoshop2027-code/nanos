const express = require('express');
const router = express.Router();
const customerCupCategoryController = require('../controllers/customerCupCategoryController');

/**
 * @swagger
 * tags:
 *   name: Customer - Cup Categories
 *   description: Browse cup categories
 */

/**
 * @swagger
 * /api/v1/customer/categories:
 *   get:
 *     summary: Get all cup categories
 *     tags: [Customer - Cup Categories]
 *     responses:
 *       200:
 *         description: Cup categories retrieved successfully
 */
router.get('/', customerCupCategoryController.getAllCategories);

/**
 * @swagger
 * /api/v1/customer/categories/{id}:
 *   get:
 *     summary: Get a cup category by ID
 *     tags: [Customer - Cup Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cup category retrieved successfully
 *       404:
 *         description: Cup category not found
 */
router.get('/:id', customerCupCategoryController.getCategoryById);

module.exports = router;
