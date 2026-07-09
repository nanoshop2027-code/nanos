const express = require('express');
const router = express.Router();
const customerOrderController = require('../controllers/customerOrderController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkoutValidation = require('../validators/checkoutValidator');

/**
 * @swagger
 * tags:
 *   name: Customer - Orders
 *   description: Checkout and order history
 */

/**
 * @swagger
 * /api/v1/customer/checkout:
 *   post:
 *     summary: Checkout (place an order)
 *     description: >
 *       Accepts a mix of menu-cup items (by cupId + quantity) and custom-cup items
 *       (by ingredient selection + quantity). A complete snapshot of every item, the
 *       ingredients used, and the business fees in effect is stored on the order —
 *       later admin changes to cups/ingredients/settings never affect past orders.
 *       Selecting paymentMethod "card" returns an error, since card payments are not
 *       yet supported.
 *     tags: [Customer - Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - deliveryInfo
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemType:
 *                       type: string
 *                       enum: [menu, custom]
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     cupId:
 *                       type: string
 *                       description: Required when itemType is "menu"
 *                     bases:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Required (min 1) when itemType is "custom"
 *                     chocolateSauces:
 *                       type: array
 *                       items:
 *                         type: string
 *                     nuts:
 *                       type: array
 *                       items:
 *                         type: string
 *                     extras:
 *                       type: array
 *                       items:
 *                         type: string
 *                 example:
 *                   - itemType: menu
 *                     cupId: 64f0c8e1a2b3c4d5e6f7a8b9
 *                     quantity: 1
 *                   - itemType: custom
 *                     bases: [64f0c8e1a2b3c4d5e6f7a8c1]
 *                     nuts: [64f0c8e1a2b3c4d5e6f7a8c2]
 *                     quantity: 2
 *               deliveryInfo:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - email
 *                   - phone
 *                   - address
 *                   - city
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card]
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Validation error, unknown cup/ingredient ID, or "Card payment is coming soon"
 *       401:
 *         description: Not authenticated
 */
router.post('/', protect, validate(checkoutValidation.checkout), customerOrderController.checkout);

module.exports = router;
