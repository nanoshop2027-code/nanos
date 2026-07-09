const mongoose = require('mongoose');

const EVENT_STATUSES = ['pending', 'contacted', 'confirmed', 'cancelled', 'completed'];
const GUEST_RANGES = ['50-100', '100-200', '200-500', '500+'];

const customerInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const eventBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    celebrationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CelebrationType',
      default: null,
    },
    customCelebrationType: {
      type: String,
      trim: true,
      default: null,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    guestsRange: {
      type: String,
      enum: GUEST_RANGES,
      required: true,
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },
    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: 'pending',
    },
    actualNumberOfGuests: {
      type: Number,
      default: null,
    },
    internalNotes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

eventBookingSchema.index({ user: 1, createdAt: -1 });
eventBookingSchema.index({ status: 1 });
eventBookingSchema.index({ celebrationType: 1 });
eventBookingSchema.index({ eventDate: 1 });

const EventBooking = mongoose.model('EventBooking', eventBookingSchema);

module.exports = EventBooking;
module.exports.EVENT_STATUSES = EVENT_STATUSES;
module.exports.GUEST_RANGES = GUEST_RANGES;
