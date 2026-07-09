const Order = require('../models/Order');
const User = require('../models/User');
const Cup = require('../models/Cup');

class DashboardService {
  async getStats() {
    const [totalOrders, revenueResult, totalUsers, totalMenuCups, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      User.countDocuments({ role: 'user' }),
      Cup.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
    ]);

    return {
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      totalUsers,
      totalMenuCups,
      pendingOrders,
    };
  }
}

module.exports = new DashboardService();
