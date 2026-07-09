const express = require('express');
const router = express.Router();
const adminEventBookingController = require('../controllers/adminEventBookingController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const eventBookingValidation = require('../validators/eventBookingValidator');

/**
 * @swagger
 * tags:
 *   name: Admin - Event Bookings
 *   description: Admin management of event booking requests
 */

/**
 * @swagger
 * /api/v1/admin/event-bookings:
 *   get:
 *     summary: Get all event bookings
 *     description: |
 *       Supports free-text search plus filtering by status, celebration type, city and event date,
 *       with pagination.
 *     tags: [Admin - Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Matches booking number, custom celebration type, customer full name, phone or city
 *         example: EVT-20260709
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, contacted, confirmed, cancelled, completed]
 *       - in: query
 *         name: celebrationType
 *         schema:
 *           type: string
 *         description: Celebration type ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         example: Cairo
 *       - in: query
 *         name: eventDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Returns bookings whose event date falls on this calendar day
 *         example: 2026-08-15
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
 *       403:
 *         description: Not authorized
 */
router.get('/', protect, restrictTo('admin', 'super-admin'), adminEventBookingController.getAllBookings);

/**
 * @swagger
 * /api/v1/admin/event-bookings/{id}:
 *   get:
 *     summary: Get an event booking by ID
 *     tags: [Admin - Event Bookings]
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
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event booking not found
 */
router.get(
  '/:id',
  protect,
  restrictTo('admin', 'super-admin'),
  adminEventBookingController.getBookingById
);

/**
 * @swagger
 * /api/v1/admin/event-bookings/{id}/status:
 *   patch:
 *     summary: Update event booking status
 *     tags: [Admin - Event Bookings]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, contacted, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Event booking status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event booking not found
 */
router.patch(
  '/:id/status',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(eventBookingValidation.updateStatus),
  adminEventBookingController.updateBookingStatus
);

/**
 * @swagger
 * /api/v1/admin/event-bookings/{id}/actual-guests:
 *   patch:
 *     summary: Update actual number of guests
 *     description: Set by the admin after communicating with the customer. Does not overwrite the customer-submitted guests range.
 *     tags: [Admin - Event Bookings]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actualNumberOfGuests
 *             properties:
 *               actualNumberOfGuests:
 *                 type: integer
 *                 minimum: 1
 *                 example: 150
 *     responses:
 *       200:
 *         description: Actual number of guests updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event booking not found
 */
router.patch(
  '/:id/actual-guests',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(eventBookingValidation.updateActualGuests),
  adminEventBookingController.updateActualGuests
);

/**
 * @swagger
 * /api/v1/admin/event-bookings/{id}/internal-notes:
 *   patch:
 *     summary: Update internal notes
 *     description: Internal, admin-only notes. Separate from the customer-submitted additional notes, which are preserved as-is.
 *     tags: [Admin - Event Bookings]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - internalNotes
 *             properties:
 *               internalNotes:
 *                 type: string
 *                 example: Customer confirmed via phone call on 2026-07-10
 *     responses:
 *       200:
 *         description: Internal notes updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event booking not found
 */
router.patch(
  '/:id/internal-notes',
  protect,
  restrictTo('admin', 'super-admin'),
  validate(eventBookingValidation.updateInternalNotes),
  adminEventBookingController.updateInternalNotes
);

module.exports = router;
