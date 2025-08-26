import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@chakra-ui/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface UploadResult {
  imageUrl: string;
  publicId: string;
  originalName: string;
  size: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { getToken } = useAuth();
  const toast = useToast();

  const validateFile = (file: File, options: UploadOptions = {}): boolean => {
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG, PNG, GIF, or WebP image.',
        status: 'error',
        duration: 5000,
      });
      return false;
    }

    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / (1024 * 1024));
      toast({
        title: 'File too large',
        description: `Please select a file smaller than ${sizeMB}MB.`,
        status: 'error',
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  const uploadImage = async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult | null> => {
    if (!validateFile(file, options)) {
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get authentication token
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
            options.onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch {
              reject(new Error('Invalid response format'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || `Upload failed: ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });
      });

      xhr.open('POST', `${API_BASE_URL}/resources/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

      const result = await uploadPromise;

      toast({
        title: 'Image uploaded successfully',
        status: 'success',
        duration: 3000,
      });

      return result;

    } catch (error) {
      console.error('Upload error:', error);
      
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        status: 'error',
        duration: 5000,
      });

      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleImages = async (
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadImage(file, options);
      if (result) {
        results.push(result);
      }
    }

    return results;
  };

  // Utility function to compress image before upload
  const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original file
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return {
    uploading,
    uploadProgress,
    uploadImage,
    uploadMultipleImages,
    compressImage,
    validateFile,
  };
};
