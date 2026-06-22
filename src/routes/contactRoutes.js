const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const contactValidation = require('../validators/contactValidator');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form management
 */

/**
 * @swagger
 * /api/v1/contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/', validate(contactValidation.createContact), contactController.createContact);

/**
 * @swagger
 * /api/v1/contact:
 *   get:
 *     summary: Get all contact submissions
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Contact submissions retrieved successfully
 */
router.get('/', protect, restrictTo('admin', 'super-admin'), contactController.getAllContacts);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   get:
 *     summary: Get contact submission by ID
 *     tags: [Contact]
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
 *         description: Contact submission retrieved successfully
 */
router.get('/:id', protect, restrictTo('admin', 'super-admin'), contactController.getContactById);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   delete:
 *     summary: Delete contact submission
 *     tags: [Contact]
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
 *         description: Contact submission deleted successfully
 */
router.delete('/:id', protect, restrictTo('admin', 'super-admin'), contactController.deleteContact);

module.exports = router;
