const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const connectDB = require('./config/database');
const createSuperAdmin = require('./utils/createSuperAdmin');
const swaggerSetup = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Admin commerce routes
const adminCupCategoryRoutes = require('./routes/adminCupCategoryRoutes');
const adminIngredientRoutes = require('./routes/adminIngredientRoutes');
const adminCupRoutes = require('./routes/adminCupRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminSettingsRoutes = require('./routes/adminSettingsRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');

// Customer commerce routes
const customerCupCategoryRoutes = require('./routes/customerCupCategoryRoutes');
const customerIngredientRoutes = require('./routes/customerIngredientRoutes');
const customerCupRoutes = require('./routes/customerCupRoutes');
const customerCustomCupRoutes = require('./routes/customerCustomCupRoutes');
const customerCheckoutRoutes = require('./routes/customerCheckoutRoutes');
const customerOrderRoutes = require('./routes/customerOrderRoutes');
const customerSettingsRoutes = require('./routes/customerSettingsRoutes');

// Admin event booking routes
const adminCelebrationTypeRoutes = require('./routes/adminCelebrationTypeRoutes');
const adminEventBookingRoutes = require('./routes/adminEventBookingRoutes');

// Customer event booking routes
const customerCelebrationTypeRoutes = require('./routes/customerCelebrationTypeRoutes');
const customerEventBookingRoutes = require('./routes/customerEventBookingRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);
app.use(`${config.apiPrefix}/admin`, adminRoutes);
app.use(`${config.apiPrefix}/contact`, contactRoutes);

// Admin commerce routes
app.use(`${config.apiPrefix}/admin/categories`, adminCupCategoryRoutes);
app.use(`${config.apiPrefix}/admin/ingredients`, adminIngredientRoutes);
app.use(`${config.apiPrefix}/admin/cups`, adminCupRoutes);
app.use(`${config.apiPrefix}/admin/orders`, adminOrderRoutes);
app.use(`${config.apiPrefix}/admin/settings`, adminSettingsRoutes);
app.use(`${config.apiPrefix}/admin/dashboard`, adminDashboardRoutes);

// Customer commerce routes
app.use(`${config.apiPrefix}/customer/categories`, customerCupCategoryRoutes);
app.use(`${config.apiPrefix}/customer/ingredients`, customerIngredientRoutes);
app.use(`${config.apiPrefix}/customer/cups`, customerCupRoutes);
app.use(`${config.apiPrefix}/customer/custom-cups`, customerCustomCupRoutes);
app.use(`${config.apiPrefix}/customer/checkout`, customerCheckoutRoutes);
app.use(`${config.apiPrefix}/customer/orders`, customerOrderRoutes);
app.use(`${config.apiPrefix}/customer/settings`, customerSettingsRoutes);

// Admin event booking routes
app.use(`${config.apiPrefix}/admin/celebration-types`, adminCelebrationTypeRoutes);
app.use(`${config.apiPrefix}/admin/event-bookings`, adminEventBookingRoutes);

// Customer event booking routes
app.use(`${config.apiPrefix}/customer/celebration-types`, customerCelebrationTypeRoutes);
app.use(`${config.apiPrefix}/customer/event-bookings`, customerEventBookingRoutes);

// Swagger documentation
swaggerSetup(app);

// 404 handler - must be after all other routes
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create super admin if not exists
    await createSuperAdmin();

    // Start server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Server running in ${config.env} mode`);
      console.log(`🌍 Server URL: http://localhost:${PORT}`);
      console.log(`📡 API Prefix: ${config.apiPrefix}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
