const jwt = require('jsonwebtoken');
const config = require('../config/config');
const RefreshToken = require('../models/RefreshToken');

class TokenService {
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiration,
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiration,
    });
  }

  generateResetPasswordToken(userId) {
    return jwt.sign({ id: userId }, config.jwt.resetPasswordSecret, {
      expiresIn: config.jwt.resetPasswordExpiration,
    });
  }

  async saveRefreshToken(userId, token) {
    const expiresAt = new Date();
    // Parse the expiration time (e.g., '7d' -> 7 days)
    const expirationDays = parseInt(config.jwt.refreshExpiration);
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    const refreshToken = await RefreshToken.create({
      token,
      user: userId,
      expiresAt,
    });

    return refreshToken;
  }

  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret);
      
      const refreshToken = await RefreshToken.findOne({ token }).populate('user');
      
      if (!refreshToken || !refreshToken.isValid()) {
        throw new Error('Invalid or expired refresh token');
      }

      return refreshToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  verifyResetPasswordToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.resetPasswordSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired reset password token');
    }
  }

  async revokeRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
      refreshToken.isRevoked = true;
      await refreshToken.save();
    }
  }

  async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany(
      { user: userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  generateTokenPair(userId) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }
}

module.exports = new TokenService();
