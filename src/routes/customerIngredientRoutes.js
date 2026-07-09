const express = require('express');
const router = express.Router();
const customerIngredientController = require('../controllers/customerIngredientController');
const mapIngredientType = require('../middleware/ingredientType');

/**
 * @swagger
 * tags:
 *   name: Customer - Ingredients
 *   description: Browse cup ingredients (bases, chocolate sauces, nuts, extras)
 */

/**
 * @swagger
 * /api/v1/customer/ingredients/{type}:
 *   get:
 *     summary: Get all ingredients of a type
 *     tags: [Customer - Ingredients]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bases, chocolate-sauces, nuts, extras]
 *     responses:
 *       200:
 *         description: Ingredients retrieved successfully
 *       404:
 *         description: Unknown ingredient type
 */
router.get('/:type', mapIngredientType, customerIngredientController.getAllIngredients);

/**
 * @swagger
 * /api/v1/customer/ingredients/{type}/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     tags: [Customer - Ingredients]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bases, chocolate-sauces, nuts, extras]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient retrieved successfully
 *       404:
 *         description: Ingredient not found
 */
router.get('/:type/:id', mapIngredientType, customerIngredientController.getIngredientById);

module.exports = router;
