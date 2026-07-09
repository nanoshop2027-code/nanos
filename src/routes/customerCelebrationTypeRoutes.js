const express = require('express');
const router = express.Router();
const customerCelebrationTypeController = require('../controllers/customerCelebrationTypeController');

/**
 * @swagger
 * tags:
 *   name: Customer - Celebration Types
 *   description: Browse available event celebration types
 */

/**
 * @swagger
 * /api/v1/customer/celebration-types:
 *   get:
 *     summary: Get all celebration types
 *     description: Public endpoint used to populate the celebration type selector on the booking form.
 *     tags: [Customer - Celebration Types]
 *     responses:
 *       200:
 *         description: Celebration types retrieved successfully
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
 *                         celebrationTypes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/CelebrationType'
 */
router.get('/', customerCelebrationTypeController.getAllCelebrationTypes);

module.exports = router;
