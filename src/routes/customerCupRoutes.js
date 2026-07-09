const express = require('express');
const router = express.Router();
const customerCupController = require('../controllers/customerCupController');

/**
 * @swagger
 * tags:
 *   name: Customer - Cups Menu
 *   description: Browse, search, filter and sort menu cups
 */

/**
 * @swagger
 * /api/v1/customer/cups:
 *   get:
 *     summary: Get all menu cups
 *     tags: [Customer - Cups Menu]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by cup name, description, or category name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: minCalories
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxCalories
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, price_asc, price_desc, calories_asc, calories_desc]
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
 *         description: Cups retrieved successfully
 */
router.get('/', customerCupController.getAllCups);

/**
 * @swagger
 * /api/v1/customer/cups/{id}:
 *   get:
 *     summary: Get a menu cup with full details
 *     tags: [Customer - Cups Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cup retrieved successfully
 *       404:
 *         description: Cup not found
 */
router.get('/:id', customerCupController.getCupById);

module.exports = router;
