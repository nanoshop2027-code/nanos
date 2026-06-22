const User = require('../models/User');
const config = require('../config/config');

const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super-admin' });

    if (existingSuperAdmin) {
      console.log('✅ Super Admin already exists');
      return;
    }

    // Validate super admin credentials from env
    if (
      !config.superAdmin.firstName ||
      !config.superAdmin.lastName ||
      !config.superAdmin.email ||
      !config.superAdmin.password
    ) {
      console.error('❌ Super Admin credentials not found in environment variables');
      return;
    }

    // Create super admin
    const superAdmin = await User.create({
      firstName: config.superAdmin.firstName,
      lastName: config.superAdmin.lastName,
      email: config.superAdmin.email,
      password: config.superAdmin.password,
      role: 'super-admin',
      isActive: true,
    });

    console.log('✅ Super Admin created successfully');
    console.log(`   Email: ${superAdmin.email}`);
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message);
  }
};

module.exports = createSuperAdmin;
