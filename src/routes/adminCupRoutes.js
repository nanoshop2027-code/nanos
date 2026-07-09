const express = require('express');
const router = express.Router();
const adminCupController = require('../controllers/adminCupController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const cupValidation = require('../validators/cupValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Cups Menu
 *   description: Admin management of menu cups
 */

/**
 * @swagger
 * /api/v1/admin/cups:
 *   post:
 *     summary: Create a menu cup
 *     description: >
 *       If originalPrice is omitted, it is computed as the sum of the selected ingredients'
 *       prices (Scenario 1). If originalPrice is provided, it is used as-is (Scenario 2).
 *       Total calories are always computed from the selected ingredients. Both price and
 *       calories are stored permanently on the cup document.
 *     tags: [Admin - Cups Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - bases
 *             properties:
 *               name:
 *                 type: string
 *                 example: Classic Chocolate Shake
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: CupCategory ID
 *               bases:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Ingredient IDs (type=base), at least one required
 *               chocolateSauces:
 *                 type: array
 *                 items:
 *                   type: string
 *               nuts:
 *                 type: array
 *                 items:
 *                   type: string
 *               extras:
 *                 type: array
 *                 items:
 *                   type: string
 *               originalPrice:
 *                 type: number
 *                 description: Optional manual original price (Scenario 2)
 *               discountPercentage:
 *                 type: number
 *                 example: 10
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cup created successfully
 *       400:
 *         description: Validation error / unknown ingredient or category
 */
router.post(
  '/',
  protect,
  restrictTo('admin', 'super-admin'),
  upload.single('image'),
  validate(cupValidation.create),
  adminCupController.createCup
);

/**
 * @swagger
 * /api/v1/admin/cups:
 *   get:
 *     summary: Get all menu cups
 *     tags: [Admin - Cups Menu]
 *     security:
 *       - bearerAuth: []
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
router.get('/', protect, restrictTo('admin', 'super-admin'), adminCupController.getAllCups);

/**
 * @swagger
 * /api/v1/admin/cups/{id}:
 *   get:
 *     summary: Get a menu cup with full details
 *     tags: [Admin - Cups Menu]
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
 *         description: Cup retrieved successfully
 *       404:
 *         description: Cup not found
 */
router.get('/:id', protect, restrictTo('admin', 'super-admin'), adminCupController.getCupById);

/**
 * @swagger
 * /api/v1/admin/cups/{id}:
 *   put:
 *     summary: Update a menu cup
 *     description: Pricing and calorie fields are recomputed and re-persisted on every update.
 *     tags: [Admin - Cups Menu]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               bases:
 *                 type: array
 *                 items:
 *                   type: string
 *               chocolateSauces:
 *                 type: array
 *                 items:
 *                   type: string
 *               nuts:
 *                 type: array
 *                 items:
 *                   type: string
 *               extras:
 *                 type: array
 *                 items:
 *                   type: string
 *               originalPrice:
 *                 type: number
 *               discountPercentage:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cup updated successfully
 *       404:
 *         description: Cup not found
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  upload.single('image'),
  validate(cupValidation.update),
  adminCupController.updateCup
);

/**
 * @swagger
 * /api/v1/admin/cups/{id}:
 *   delete:
 *     summary: Delete a menu cup
 *     tags: [Admin - Cups Menu]
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
 *         description: Cup deleted successfully
 *       404:
 *         description: Cup not found
 */
router.delete('/:id', protect, restrictTo('admin', 'super-admin'), adminCupController.deleteCup);

module.exports = router;
