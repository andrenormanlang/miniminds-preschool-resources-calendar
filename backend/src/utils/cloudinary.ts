import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    
    // Log for debugging
    console.log("Cloudinary upload params:", {
      folder: 'miniminds',
      upload_preset: uploadPreset,
      has_preset: !!uploadPreset
    });
    
    const params: any = {
      folder: 'miniminds', 
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: 'auto',
    };
    
    // Add upload_preset if available (required for production)
    if (uploadPreset) {
      params.upload_preset = uploadPreset;
    } else {
      console.warn("⚠️  CLOUDINARY_UPLOAD_PRESET is missing - uploads may fail in production");
    }
    
    return params;
  },
});

// Export cloudinary instance for direct use
export default cloudinary;
