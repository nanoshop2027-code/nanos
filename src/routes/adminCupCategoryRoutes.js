const express = require('express');
const router = express.Router();
const adminCupCategoryController = require('../controllers/adminCupCategoryController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const cupCategoryValidation = require('../validators/cupCategoryValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Cup Categories
 *   description: Admin management of cup categories
 */

/**
 * @swagger
 * /api/v1/admin/categories:
 *   post:
 *     summary: Create a cup category
 *     tags: [Admin - Cup Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Milkshakes
 *               description:
 *                 type: string
 *                 example: Creamy blended milkshakes
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cup category created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.post(
  '/',
  protect,
  restrictTo('admin', 'super-admin'),
  upload.single('image'),
  validate(cupCategoryValidation.create),
  adminCupCategoryController.createCategory
);

/**
 * @swagger
 * /api/v1/admin/categories:
 *   get:
 *     summary: Get all cup categories
 *     tags: [Admin - Cup Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cup categories retrieved successfully
 */
router.get('/', protect, restrictTo('admin', 'super-admin'), adminCupCategoryController.getAllCategories);

/**
 * @swagger
 * /api/v1/admin/categories/{id}:
 *   get:
 *     summary: Get a cup category by ID
 *     tags: [Admin - Cup Categories]
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
 *         description: Cup category retrieved successfully
 *       404:
 *         description: Cup category not found
 */
router.get('/:id', protect, restrictTo('admin', 'super-admin'), adminCupCategoryController.getCategoryById);

/**
 * @swagger
 * /api/v1/admin/categories/{id}:
 *   put:
 *     summary: Update a cup category
 *     tags: [Admin - Cup Categories]
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cup category updated successfully
 *       404:
 *         description: Cup category not found
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  upload.single('image'),
  validate(cupCategoryValidation.update),
  adminCupCategoryController.updateCategory
);

/**
 * @swagger
 * /api/v1/admin/categories/{id}:
 *   delete:
 *     summary: Delete a cup category
 *     tags: [Admin - Cup Categories]
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
 *         description: Cup category deleted successfully
 *       404:
 *         description: Cup category not found
 */
router.delete('/:id', protect, restrictTo('admin', 'super-admin'), adminCupCategoryController.deleteCategory);

module.exports = router;
