import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { Request } from 'express';

export interface UploadResult {
  imageUrl: string;
  publicId: string;
  originalName: string;
  size: number;
  width?: number;
  height?: number;
}

export class UploadService {
  /**
   * Upload image from buffer (useful for direct uploads)
   */
  static async uploadImage(
    buffer: Buffer,
    originalName: string,
    options?: {
      folder?: string;
      tags?: string[];
      transformation?: any[];
    }
  ): Promise<UploadResult> {
    try {
      const result = await uploadToCloudinary(buffer, {
        folder: options?.folder || 'miniminds/resources',
        tags: options?.tags || ['miniminds', 'resource'],
        transformation: options?.transformation
      });

      return {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        originalName,
        size: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadImages(
    files: Array<{ buffer: Buffer; originalName: string }>,
    options?: {
      folder?: string;
      tags?: string[];
    }
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => 
      this.uploadImage(file.buffer, file.originalName, options)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error(`Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete image by public ID
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  static extractPublicId(imageUrl: string): string | null {
    try {
      const matches = imageUrl.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|avif)$/i);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File too large. Maximum size is 10MB.'
      };
    }

    return { isValid: true };
  }

  /**
   * Get image dimensions and metadata
   */
  static async getImageMetadata(publicId: string) {
    try {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const result = await cloudinary.api.resource(publicId);
      
      return {
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        created: result.created_at,
        url: result.secure_url
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      throw new Error('Failed to get image metadata');
    }
  }
}
