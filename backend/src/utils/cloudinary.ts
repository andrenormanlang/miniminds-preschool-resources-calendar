import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'miniminds', 
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: 'auto',
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
    };
  },
});

// Export cloudinary instance for direct use
export default cloudinary;
