const express = require('express');
const router = express.Router();
const adminIngredientController = require('../controllers/adminIngredientController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const mapIngredientType = require('../middleware/ingredientType');
const ingredientValidation = require('../validators/ingredientValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Ingredients
 *   description: Admin management of cup ingredients (bases, chocolate sauces, nuts, extras)
 */

/**
 * @swagger
 * /api/v1/admin/ingredients/{type}:
 *   post:
 *     summary: Create an ingredient
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Ingredient type
 *         schema:
 *           type: string
 *           enum: [bases, chocolate-sauces, nuts, extras]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - calories
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Whole Milk
 *               calories:
 *                 type: number
 *                 example: 120
 *               price:
 *                 type: number
 *                 example: 1.5
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Unknown ingredient type
 */
router.post(
  '/:type',
  protect,
  restrictTo('admin', 'super-admin'),
  mapIngredientType,
  upload.single('image'),
  validate(ingredientValidation.create),
  adminIngredientController.createIngredient
);

/**
 * @swagger
 * /api/v1/admin/ingredients/{type}:
 *   get:
 *     summary: Get all ingredients of a type
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
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
 */
router.get(
  '/:type',
  protect,
  restrictTo('admin', 'super-admin'),
  mapIngredientType,
  adminIngredientController.getAllIngredients
);

/**
 * @swagger
 * /api/v1/admin/ingredients/{type}/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
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
router.get(
  '/:type/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  mapIngredientType,
  adminIngredientController.getIngredientById
);

/**
 * @swagger
 * /api/v1/admin/ingredients/{type}/{id}:
 *   put:
 *     summary: Update an ingredient
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               calories:
 *                 type: number
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Ingredient updated successfully
 *       404:
 *         description: Ingredient not found
 */
router.put(
  '/:type/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  mapIngredientType,
  upload.single('image'),
  validate(ingredientValidation.update),
  adminIngredientController.updateIngredient
);

/**
 * @swagger
 * /api/v1/admin/ingredients/{type}/{id}:
 *   delete:
 *     summary: Delete an ingredient
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
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
 *         description: Ingredient deleted successfully
 *       404:
 *         description: Ingredient not found
 */
router.delete(
  '/:type/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  mapIngredientType,
  adminIngredientController.deleteIngredient
);

module.exports = router;
