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

  // Log configuration (without secrets) for debugging
  console.log('Cloudinary Configuration:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'MISSING',
  });
};

// Initialize and validate configuration
validateConfig();

// CRITICAL: Ensure proper configuration format
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true, // Always use HTTPS
  // Add explicit configuration to ensure signed uploads
  signature_algorithm: 'sha256', // Explicitly set signature algorithm
  api_version: '1_1', // Explicitly set API version
});

// Test the configuration immediately
const testCloudinaryConfig = async () => {
  try {
    // Test the configuration by checking account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary configuration test successful:', result);
  } catch (error) {
    console.error('❌ Cloudinary configuration test failed:', error);
    throw new Error('Cloudinary configuration is invalid');
  }
};

// Call test function at startup (comment out in production if needed)
testCloudinaryConfig().catch(console.error);

// Optimized storage configuration with explicit signed upload settings
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate unique public_id using crypto
    const uniqueId = crypto.randomUUID();
    const timestamp = Date.now();
    
    // IMPORTANT: These parameters ensure a signed upload
    const uploadParams = {
      folder: 'miniminds/resources',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'avif'],
      public_id: `resource_${timestamp}_${uniqueId}`,
      resource_type: 'auto' as const,
      // Explicitly set as signed upload (this is crucial)
      use_filename: false,
      unique_filename: true,
      overwrite: false,
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
      },
      // Ensure proper tagging for organization
      tags: ['miniminds', 'resource', 'auto-upload']
    };

    console.log('Upload params:', {
      folder: uploadParams.folder,
      public_id: uploadParams.public_id,
      resource_type: uploadParams.resource_type
    });

    return uploadParams;
  },
});

// Alternative direct upload function with explicit signing
export const uploadToCloudinary = async (
  buffer: Buffer,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any[];
    tags?: string[];
  } = {}
): Promise<UploadApiResponse> => {
  const uniqueId = crypto.randomUUID();
  const timestamp = Date.now();
  
  const defaultOptions = {
    folder: 'miniminds/resources',
    public_id: options.public_id || `resource_${timestamp}_${uniqueId}`,
    resource_type: 'auto' as const,
    quality: 'auto:good',
    fetch_format: 'auto',
    use_filename: false,
    unique_filename: true,
    overwrite: false,
    transformation: [
      {
        quality: 'auto:good',
        fetch_format: 'auto',
        width: 1200,
        height: 800,
        crop: 'limit'
      }
    ],
    tags: ['miniminds', 'resource', ...(options.tags || [])],
    context: {
      upload_timestamp: new Date().toISOString(),
      uploaded_by: 'miniminds_app'
    },
    ...options
  };

  console.log('Direct upload with options:', {
    folder: defaultOptions.folder,
    public_id: defaultOptions.public_id,
    resource_type: defaultOptions.resource_type
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary direct upload error:', error);
          reject(error);
        } else if (result) {
          console.log('✅ Direct upload successful:', {
            public_id: result.public_id,
            url: result.secure_url
          });
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