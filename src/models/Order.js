const mongoose = require('mongoose');

const ORDER_STATUSES = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const orderIngredientSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, default: null },
    calories: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    itemType: { type: String, enum: ['menu', 'custom'], required: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, default: null },
    categoryName: { type: String },
    cupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cup' },
    originalPrice: { type: Number, required: true },
    discountPercentage: { type: Number, required: true, default: 0 },
    finalPrice: { type: Number, required: true },
    totalCalories: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    ingredients: { type: [orderIngredientSnapshotSchema], default: [] },
  },
  { _id: false }
);

const feeSnapshotSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'An order must contain at least one item',
      },
    },
    deliveryInfo: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, trim: true },
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card'],
      required: true,
    },
    fees: {
      deliveryFee: { type: feeSnapshotSchema, required: true },
      packagingFee: { type: feeSnapshotSchema, required: true },
    },
    itemsSubtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
module.exports.ORDER_STATUSES = ORDER_STATUSES;
