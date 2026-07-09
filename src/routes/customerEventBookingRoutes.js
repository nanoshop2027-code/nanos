const express = require('express');
const router = express.Router();
const customerEventBookingController = require('../controllers/customerEventBookingController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const eventBookingValidation = require('../validators/eventBookingValidator');

/**
 * @swagger
 * tags:
 *   name: Customer - Event Bookings
 *   description: Submit and track event booking requests
 */

/**
 * @swagger
 * /api/v1/customer/event-bookings:
 *   post:
 *     summary: Create an event booking request
 *     description: |
 *       Creates an Event Booking record. The backend only stores the request — it does **not**
 *       send WhatsApp messages. The frontend is expected to redirect the customer to WhatsApp
 *       after a successful response.
 *
 *       Provide either `celebrationTypeId` (one of the admin-managed celebration types) **or**
 *       `customCelebrationType` (free text, used when the customer picks "Other") — exactly one
 *       of the two is required, not both.
 *     tags: [Customer - Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventDate
 *               - guestsRange
 *               - fullName
 *               - phone
 *               - city
 *             properties:
 *               celebrationTypeId:
 *                 type: string
 *                 description: Required unless customCelebrationType is provided
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               customCelebrationType:
 *                 type: string
 *                 description: Required when celebrationTypeId is omitted ("Other")
 *                 example: Corporate Party
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-15T18:00:00.000Z
 *               guestsRange:
 *                 type: string
 *                 enum: ['50-100', '100-200', '200-500', '500+']
 *                 example: 100-200
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               phone:
 *                 type: string
 *                 example: '01012345678'
 *               city:
 *                 type: string
 *                 example: Cairo
 *               notes:
 *                 type: string
 *                 description: Optional additional notes from the customer
 *                 example: Would like an outdoor venue
 *     responses:
 *       201:
 *         description: Event booking submitted successfully
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
 *                         booking:
 *                           $ref: '#/components/schemas/EventBooking'
 *       400:
 *         description: Validation error (e.g. missing both/neither celebrationTypeId and customCelebrationType, past event date)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Celebration type not found
 */
router.post(
  '/',
  protect,
  validate(eventBookingValidation.create),
  customerEventBookingController.createBooking
);

/**
 * @swagger
 * /api/v1/customer/event-bookings:
 *   get:
 *     summary: Get my event bookings
 *     tags: [Customer - Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Event bookings retrieved successfully
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
 *                         bookings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/EventBooking'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Not authenticated
 */
router.get('/', protect, customerEventBookingController.getMyBookings);

/**
 * @swagger
 * /api/v1/customer/event-bookings/{id}:
 *   get:
 *     summary: Get my event booking details
 *     tags: [Customer - Event Bookings]
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
 *         description: Event booking retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Event booking not found (or does not belong to the current user)
 */
router.get('/:id', protect, customerEventBookingController.getMyBookingById);

module.exports = router;
