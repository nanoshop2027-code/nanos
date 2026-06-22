const { sendEmail } = require('../config/email');

class EmailService {
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }

  async sendWelcomeEmail(email, firstName) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Nanos E-Commerce!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for registering with us. We're excited to have you on board!</p>
        <p>You can now enjoy shopping with exclusive deals and offers.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Happy Shopping!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Welcome to Nanos E-Commerce',
      html,
    });
  }

  async sendAdminCreatedEmail(email, firstName, password) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Admin Account Created</h2>
        <p>Hi ${firstName},</p>
        <p>An admin account has been created for you.</p>
        <p><strong>Your Login Credentials:</strong></p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <p style="color: #d9534f;"><strong>Important:</strong> Please change your password after logging in for the first time.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Admin Account Created',
      html,
    });
  }

  async sendContactConfirmation(email, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Contacting Us</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Our team typically responds within 24-48 hours.</p>
        <p>Thank you for your patience!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'We Received Your Message',
      html,
    });
  }
}

module.exports = new EmailService();
