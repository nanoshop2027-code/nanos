# Nanos E-Commerce API

A production-ready RESTful API for an E-commerce application built with Node.js, Express.js, MongoDB, and JWT authentication.

## 🚀 Features

### Authentication & Authorization
- ✅ User Registration with email/phone
- ✅ User Login (email or phone)
- ✅ JWT Access Token & Refresh Token implementation
- ✅ Forgot Password & Reset Password flow
- ✅ Change Password (authenticated users)
- ✅ Role-based Access Control (Super Admin, Admin, User)
- ✅ Auto-create Super Admin on startup

### User Management
- ✅ User Profile Management
- ✅ Profile Image Upload/Update/Delete using ImageKit
- ✅ User CRUD operations (Admin only)
- ✅ Pagination support

### Admin Features
- ✅ Create Admin accounts (Super Admin only)
- ✅ Manage all users
- ✅ View contact form submissions

### Contact Form
- ✅ Public contact form submission
- ✅ Email notification on submission
- ✅ Admin panel to view/manage submissions

### Technical Features
- ✅ Comprehensive input validation using Joi
- ✅ Centralized error handling
- ✅ Async error wrapper
- ✅ Image upload and management with ImageKit
- ✅ Email service with Nodemailer (SMTP)
- ✅ Security best practices (helmet, rate limiting)
- ✅ CORS enabled
- ✅ API documentation with Swagger/OpenAPI
- ✅ Clean architecture and modular structure
- ✅ Environment-based configuration

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB
- ImageKit account
- SMTP email service (Gmail recommended)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nanos
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Super Admin Credentials (will be auto-created on startup)
SUPER_ADMIN_FIRST_NAME=Super
SUPER_ADMIN_LAST_NAME=Admin
SUPER_ADMIN_EMAIL=superadmin@nanos.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123!

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint

# API Configuration
API_PREFIX=/api/v1
```

## 🚦 Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Once the server is running, access the interactive API documentation:
- **Swagger UI**: `http://localhost:5000/api-docs`

## 🔐 Authentication

### Roles
- **Super Admin**: Full system access, only one exists
- **Admin**: Manage users and content
- **User**: Regular user access

### Authentication Flow

1. **Register/Login** → Receive `accessToken` and `refreshToken`
2. **Use accessToken** in Authorization header: `Bearer <token>`
3. **Refresh** when accessToken expires using refreshToken
4. **Logout** to invalidate refresh token

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login user
POST   /api/v1/auth/forgot-password   - Request password reset
POST   /api/v1/auth/reset-password    - Reset password with token
POST   /api/v1/auth/change-password   - Change password (authenticated)
POST   /api/v1/auth/refresh-token     - Refresh access token
POST   /api/v1/auth/logout            - Logout user
GET    /api/v1/auth/me                - Get current user
```

### User Profile
```
PUT    /api/v1/users/profile          - Update profile
POST   /api/v1/users/profile-image    - Upload profile image
PUT    /api/v1/users/profile-image    - Update profile image
DELETE /api/v1/users/profile-image    - Delete profile image
```

### Admin (Admin/Super Admin only)
```
POST   /api/v1/admin/create-admin     - Create admin (Super Admin only)
GET    /api/v1/admin/users            - Get all users
GET    /api/v1/admin/users/:id        - Get user by ID
PUT    /api/v1/admin/users/:id        - Update user
DELETE /api/v1/admin/users/:id        - Delete user
```

### Contact
```
POST   /api/v1/contact                - Submit contact form
GET    /api/v1/contact                - Get all submissions (Admin)
GET    /api/v1/contact/:id            - Get submission by ID (Admin)
DELETE /api/v1/contact/:id            - Delete submission (Admin)
```

## 🏗️ Project Structure

```
nanos/
├── src/
│   ├── config/
│   │   ├── config.js           - Configuration management
│   │   ├── database.js         - MongoDB connection
│   │   ├── email.js            - Email configuration
│   │   ├── imagekit.js         - ImageKit setup
│   │   └── swagger.js          - Swagger configuration
│   ├── controllers/
│   │   ├── authController.js   - Authentication logic
│   │   ├── userController.js   - User management
│   │   ├── adminController.js  - Admin operations
│   │   └── contactController.js- Contact form
│   ├── middleware/
│   │   ├── auth.js             - Authentication & authorization
│   │   ├── errorHandler.js     - Error handling
│   │   ├── upload.js           - File upload (multer)
│   │   └── validate.js         - Validation middleware
│   ├── models/
│   │   ├── User.js             - User schema
│   │   ├── RefreshToken.js     - Refresh token schema
│   │   └── Contact.js          - Contact schema
│   ├── routes/
│   │   ├── authRoutes.js       - Auth endpoints
│   │   ├── userRoutes.js       - User endpoints
│   │   ├── adminRoutes.js      - Admin endpoints
│   │   └── contactRoutes.js    - Contact endpoints
│   ├── services/
│   │   ├── emailService.js     - Email sending
│   │   ├── imageService.js     - Image management
│   │   └── tokenService.js     - JWT operations
│   ├── utils/
│   │   ├── AppError.js         - Custom error class
│   │   ├── asyncHandler.js     - Async wrapper
│   │   ├── responseHandler.js  - Response formatting
│   │   └── createSuperAdmin.js - Super admin seeder
│   ├── validators/
│   │   ├── authValidator.js    - Auth validation schemas
│   │   └── contactValidator.js - Contact validation
│   └── app.js                  - Application entry point
├── .env                        - Environment variables
├── .env.example                - Environment template
├── .gitignore                  - Git ignore rules
├── package.json                - Dependencies
└── README.md                   - Documentation
```

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Refresh token rotation
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- Input validation with Joi
- CORS configuration
- Environment-based secrets

## 📧 Email Templates

The application sends emails for:
- Welcome email on registration
- Password reset instructions
- Admin account creation notification
- Contact form confirmation

## 🖼️ Image Upload

Images are uploaded to ImageKit with:
- Maximum file size: 5MB
- Supported formats: All image types
- Automatic old image deletion on update
- Secure file storage

## 🧪 Testing

Use the Swagger documentation at `http://localhost:5000/api-docs` to test all endpoints interactively.

### Example: Register a new user
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

## 🐛 Error Handling

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment
2. Use strong, unique values for all secrets
3. Configure production MongoDB URI
4. Set up SSL/TLS for HTTPS
5. Configure reverse proxy (nginx)
6. Enable production-grade logging
7. Set up monitoring and alerts

## 📝 Future Enhancements

This API is designed to be easily extended with:
- Product management
- Categories and subcategories
- Shopping cart
- Order management
- Payment integration
- Reviews and ratings
- Wishlist
- Inventory management
- Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for Nanos E-Commerce

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- ImageKit for image management
- Nodemailer for email services
- JWT for authentication
- Joi for validation
- Swagger for API documentation
