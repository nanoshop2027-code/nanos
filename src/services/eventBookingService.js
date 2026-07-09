const EventBooking = require('../models/EventBooking');
const CelebrationType = require('../models/CelebrationType');
const AppError = require('../utils/AppError');

const BOOKING_NUMBER_PREFIX = 'EVT';
const MAX_BOOKING_NUMBER_ATTEMPTS = 5;
const POPULATE_FIELDS = 'name image';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class EventBookingService {
  async createBooking(user, payload) {
    if (payload.celebrationTypeId) {
      const celebrationType = await CelebrationType.findById(payload.celebrationTypeId);
      if (!celebrationType) {
        throw new AppError('Celebration type not found', 404);
      }
    }

    return this._createWithBookingNumber({
      user: user._id,
      celebrationType: payload.celebrationTypeId || null,
      customCelebrationType: payload.celebrationTypeId ? null : payload.customCelebrationType,
      eventDate: payload.eventDate,
      guestsRange: payload.guestsRange,
      customerInfo: {
        fullName: payload.fullName,
        phone: payload.phone,
        city: payload.city,
        notes: payload.notes,
      },
    });
  }

  async _createWithBookingNumber(bookingData) {
    for (let attempt = 0; attempt < MAX_BOOKING_NUMBER_ATTEMPTS; attempt += 1) {
      const bookingNumber = await this._nextBookingNumber();
      try {
        return await EventBooking.create({ ...bookingData, bookingNumber });
      } catch (err) {
        const isLastAttempt = attempt === MAX_BOOKING_NUMBER_ATTEMPTS - 1;
        if (err.code === 11000 && !isLastAttempt) {
          continue;
        }
        throw err;
      }
    }
    throw new AppError('Failed to generate a unique booking number, please try again', 500);
  }

  async _nextBookingNumber() {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const countToday = await EventBooking.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    return `${BOOKING_NUMBER_PREFIX}-${datePart}-${String(countToday + 1).padStart(5, '0')}`;
  }

  async listForAdmin({ search, status, celebrationType, city, eventDate, page = 1, limit = 10 } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (celebrationType) filter.celebrationType = celebrationType;
    if (city) filter['customerInfo.city'] = new RegExp(`^${escapeRegex(city)}$`, 'i');

    if (eventDate) {
      const day = new Date(eventDate);
      const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      filter.eventDate = { $gte: startOfDay, $lt: endOfDay };
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { bookingNumber: regex },
        { customCelebrationType: regex },
        { 'customerInfo.fullName': regex },
        { 'customerInfo.phone': regex },
        { 'customerInfo.city': regex },
      ];
    }

    return this._paginate(filter, page, limit);
  }

  async listForUser(userId, { page = 1, limit = 10 } = {}) {
    return this._paginate({ user: userId }, page, limit);
  }

  async _paginate(filter, page, limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      EventBooking.find(filter)
        .populate('celebrationType', POPULATE_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      EventBooking.countDocuments(filter),
    ]);

    return {
      bookings,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  async findByIdScoped(id, { userId, isAdmin }) {
    const booking = await EventBooking.findById(id).populate('celebrationType', POPULATE_FIELDS);
    if (!booking || (!isAdmin && String(booking.user) !== String(userId))) {
      throw new AppError('Event booking not found', 404);
    }
    return booking;
  }

  async updateStatus(id, status) {
    const booking = await this._findRawById(id);
    booking.status = status;
    await booking.save();
    return booking;
  }

  async updateActualGuests(id, actualNumberOfGuests) {
    const booking = await this._findRawById(id);
    booking.actualNumberOfGuests = actualNumberOfGuests;
    await booking.save();
    return booking;
  }

  async updateInternalNotes(id, internalNotes) {
    const booking = await this._findRawById(id);
    booking.internalNotes = internalNotes;
    await booking.save();
    return booking;
  }

  async _findRawById(id) {
    const booking = await EventBooking.findById(id);
    if (!booking) {
      throw new AppError('Event booking not found', 404);
    }
    return booking;
  }
}

module.exports = new EventBookingService();
