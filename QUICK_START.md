# Quick Start Guide - Nanos E-Commerce API

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Server
```bash
cd nanos
npm start
```

### Step 2: Access API Documentation
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

### Step 3: Test the API

**Login as Super Admin:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@nanos.com",
    "password": "SuperAdmin@123"
  }'
```

**Register a New User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

**Submit Contact Form:**
```bash
curl -X POST http://localhost:5000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Request",
    "email": "customer@example.com",
    "message": "I need assistance with my order"
  }'
```

## 📌 Important URLs

- **API Base URL**: `http://localhost:5000/api/v1`
- **Swagger Documentation**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## 🔑 Default Credentials

**Super Admin:**
- Email: `superadmin@nanos.com`
- Password: `SuperAdmin@123`

## 📝 Key Features

✅ User Registration & Login (Email or Phone)  
✅ JWT Authentication with Refresh Tokens  
✅ Password Reset Flow  
✅ Profile Image Upload (ImageKit)  
✅ Role-Based Access Control  
✅ Contact Form with Email Notifications  
✅ Admin User Management  
✅ Comprehensive API Documentation  

## 🛠️ Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

## 📖 API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/change-password` - Change password (authenticated)
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### User Profile
- `PUT /api/v1/users/profile` - Update profile
- `POST /api/v1/users/profile-image` - Upload profile image
- `PUT /api/v1/users/profile-image` - Update profile image
- `DELETE /api/v1/users/profile-image` - Delete profile image

### Admin (Admin/Super Admin only)
- `POST /api/v1/admin/create-admin` - Create admin (Super Admin only)
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get user by ID
- `PUT /api/v1/admin/users/:id` - Update user
- `DELETE /api/v1/admin/users/:id` - Delete user

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - Get all submissions (Admin)
- `GET /api/v1/contact/:id` - Get submission by ID (Admin)
- `DELETE /api/v1/contact/:id` - Delete submission (Admin)

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Refresh token rotation
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Input validation with Joi
- CORS enabled

## 📧 Email Features

The application sends emails for:
- Welcome email on registration
- Password reset instructions
- Admin account creation notifications
- Contact form confirmations

## 🖼️ Image Upload

- **Service**: ImageKit
- **Max Size**: 5MB
- **Formats**: All image types
- **Features**: Automatic old image deletion on update

## 🆘 Troubleshooting

**Server won't start?**
- Check MongoDB connection string in `.env`
- Ensure port 5000 is not in use

**Can't login?**
- Verify credentials match those in `.env` for super admin
- Check if user exists in database

**Email not sending?**
- Verify SMTP credentials in `.env`
- Check SMTP_PASSWORD is an app-specific password (for Gmail)

## 📚 Learn More

- Full Documentation: See `README.md`
- API Reference: `http://localhost:5000/api-docs`
- Testing Results: See `API_TESTING_RESULTS.md`

---

**Happy Coding! 🎉**
