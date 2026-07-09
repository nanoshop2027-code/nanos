const express = require('express');
const router = express.Router();
const customerCustomCupController = require('../controllers/customerCustomCupController');
const validate = require('../middleware/validate');
const customCupValidation = require('../validators/customCupValidator');

/**
 * @swagger
 * tags:
 *   name: Customer - Custom Cup
 *   description: Build and preview a custom cup (no persistence — the actual custom cup is only saved as an order snapshot at checkout)
 */

/**
 * @swagger
 * /api/v1/customer/custom-cups/preview:
 *   post:
 *     summary: Preview a custom cup's total calories and price
 *     description: >
 *       Stateless calculation only — nothing is persisted. Send the same ingredient
 *       selection directly inside the checkout request's items to actually order it.
 *     tags: [Customer - Custom Cup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bases
 *             properties:
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
 *     responses:
 *       200:
 *         description: Preview calculated successfully
 *       400:
 *         description: Validation error / unknown ingredient ID
 */
router.post('/preview', validate(customCupValidation.preview), customerCustomCupController.preview);

module.exports = router;
