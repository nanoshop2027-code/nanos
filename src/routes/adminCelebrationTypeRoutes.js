const express = require('express');
const router = express.Router();
const adminCelebrationTypeController = require('../controllers/adminCelebrationTypeController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const celebrationTypeValidation = require('../validators/celebrationTypeValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Celebration Types
 *   description: Admin management of event celebration types (Birthday, Wedding, etc.)
 */

/**
 * @swagger
 * /api/v1/admin/celebration-types:
 *   post:
 *     summary: Create a celebration type
 *     tags: [Admin - Celebration Types]
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
 *                 example: Birthday
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional celebration type image
 *     responses:
 *       201:
 *         description: Celebration type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         celebrationType:
 *                           $ref: '#/components/schemas/CelebrationType'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (requires admin or super-admin role)
 */
router.post(
  '/',
  protect,
  restrictTo('admin', 'super-admin'),
  upload.single('image'),
  validate(celebrationTypeValidation.create),
  adminCelebrationTypeController.createCelebrationType
);

/**
 * @swagger
 * /api/v1/admin/celebration-types:
 *   get:
 *     summary: Get all celebration types
 *     tags: [Admin - Celebration Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Celebration types retrieved successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get(
  '/',
  protect,
  restrictTo('admin', 'super-admin'),
  adminCelebrationTypeController.getAllCelebrationTypes
);

/**
 * @swagger
 * /api/v1/admin/celebration-types/{id}:
 *   get:
 *     summary: Get a celebration type by ID
 *     tags: [Admin - Celebration Types]
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
 *         description: Celebration type retrieved successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Celebration type not found
 */
router.get(
  '/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  adminCelebrationTypeController.getCelebrationTypeById
);

/**
 * @swagger
 * /api/v1/admin/celebration-types/{id}:
 *   put:
 *     summary: Update a celebration type
 *     tags: [Admin - Celebration Types]
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Celebration type updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Celebration type not found
 */
router.put(
  '/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  upload.single('image'),
  validate(celebrationTypeValidation.update),
  adminCelebrationTypeController.updateCelebrationType
);

/**
 * @swagger
 * /api/v1/admin/celebration-types/{id}:
 *   delete:
 *     summary: Delete a celebration type
 *     tags: [Admin - Celebration Types]
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
 *         description: Celebration type deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Celebration type not found
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  adminCelebrationTypeController.deleteCelebrationType
);

module.exports = router;
