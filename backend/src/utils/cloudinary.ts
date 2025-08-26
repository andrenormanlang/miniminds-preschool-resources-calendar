import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Validate configuration on startup
const validateConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Cloudinary environment variables: ${missing.join(', ')}`);
  }
};

// Initialize and validate configuration
validateConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true, // Always use HTTPS
});

// Optimized storage configuration
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate unique public_id using crypto
    const uniqueId = crypto.randomUUID();
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    
    return {
      folder: 'miniminds/resources',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'avif'],
      public_id: `resource_${timestamp}_${uniqueId}`,
      resource_type: 'auto',
      // Optimize images automatically
      transformation: [
        {
          quality: 'auto:good',
          fetch_format: 'auto',
          width: 1200,
          height: 800,
          crop: 'limit'
        }
      ],
      // Add useful metadata
      context: {
        original_filename: file.originalname,
        upload_timestamp: new Date().toISOString(),
        uploaded_by: 'miniminds_app'
      }
    };
  },
});

// Direct upload function for more control
export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any[];
    tags?: string[];
  } = {}
): Promise<UploadApiResponse> => {
  const defaultOptions = {
    folder: 'miniminds/resources',
    resource_type: 'auto' as const,
    quality: 'auto:good',
    fetch_format: 'auto',
    transformation: [
      {
        quality: 'auto:good',
        fetch_format: 'auto',
        width: 1200,
        height: 800,
        crop: 'limit'
      }
    ],
    ...options
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      }
    ).end(buffer);
  });
};

// Delete image function
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Get optimized URL for existing images
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
} = {}): string => {
  return cloudinary.url(publicId, {
    quality: options.quality || 'auto:good',
    fetch_format: options.format || 'auto',
    width: options.width,
    height: options.height,
    crop: 'limit',
    secure: true
  });
};

// Export cloudinary instance for direct use
export default cloudinary;
