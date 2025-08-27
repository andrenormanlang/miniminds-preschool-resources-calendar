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

    // Create FormData with just the file - remove the preset filename
    const formData = new FormData();
    formData.append('image', file); // Remove the 'miniminds_preset' filename

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get authentication token
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      // Create XMLHttpRequest for progress tracking with retry logic
      const uploadWithRetry = async (retries = 3): Promise<UploadResult> => {
        return new Promise<UploadResult>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          // Add timeout to prevent hanging requests
          xhr.timeout = 30000; // 30 seconds timeout
          
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
              } catch (parseError) {
                console.error('Response parsing error:', parseError);
                reject(new Error('Invalid response format'));
              }
            } else {
              try {
                const error = JSON.parse(xhr.responseText);
                console.error('Upload failed with status:', xhr.status, 'Error:', error);
                
                // If it's a 400 error and we have retries left, try again after a short delay
                if (xhr.status === 400 && retries > 0) {
                  console.log(`Retrying upload... (${retries} attempts left)`);
                  setTimeout(() => {
                    uploadWithRetry(retries - 1).then(resolve).catch(reject);
                  }, 1000); // Wait 1 second before retry
                  return;
                }
                
                reject(new Error(error.message || `Upload failed: ${xhr.status}`));
              } catch (parseError) {
                console.error('Error response parsing failed:', parseError);
                reject(new Error(`Upload failed: ${xhr.status}`));
              }
            }
          });

          xhr.addEventListener('error', () => {
            console.error('Network error during upload');
            if (retries > 0) {
              console.log(`Retrying upload due to network error... (${retries} attempts left)`);
              setTimeout(() => {
                uploadWithRetry(retries - 1).then(resolve).catch(reject);
              }, 1000);
            } else {
              reject(new Error('Network error during upload'));
            }
          });

          xhr.addEventListener('timeout', () => {
            console.error('Upload timeout');
            if (retries > 0) {
              console.log(`Retrying upload due to timeout... (${retries} attempts left)`);
              setTimeout(() => {
                uploadWithRetry(retries - 1).then(resolve).catch(reject);
              }, 1000);
            } else {
              reject(new Error('Upload timeout'));
            }
          });

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'));
          });

          // Add cache-busting headers to prevent cached responses
          xhr.open('POST', `${API_BASE_URL}/resources/upload`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          xhr.setRequestHeader('Pragma', 'no-cache');
          xhr.setRequestHeader('Expires', '0');
          
          // Send the request
          xhr.send(formData);
        });
      };

      const result = await uploadWithRetry();

      toast({
        title: 'Image uploaded successfully',
        status: 'success',
        duration: 3000,
      });

      return result;

    } catch (error) {
      console.error('Upload error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
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
    
    // Add a small delay between uploads to prevent overwhelming the server
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (i > 0) {
        // Wait 500ms between uploads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
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

      img.onerror = () => {
        resolve(file); // Fallback to original file on error
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