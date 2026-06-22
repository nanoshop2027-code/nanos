const imagekit = require('../config/imagekit');
const AppError = require('../utils/AppError');

class ImageService {
  async uploadImage(file, folder = 'profile-images') {
    try {
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}_${file.originalname}`,
        folder: folder,
      });

      return {
        url: result.url,
        fileId: result.fileId,
      };
    } catch (error) {
      throw new AppError('Failed to upload image', 500);
    }
  }

  async deleteImage(fileId) {
    try {
      await imagekit.deleteFile(fileId);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  async updateImage(oldFileId, newFile, folder = 'profile-images') {
    // Delete old image if exists
    if (oldFileId) {
      await this.deleteImage(oldFileId);
    }

    // Upload new image
    return await this.uploadImage(newFile, folder);
  }
}

module.exports = new ImageService();
