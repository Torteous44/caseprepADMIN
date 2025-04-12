// Cloudinary Image Upload Utility
// This file interfaces with the backend /api/v1/images/upload endpoint

import api from '../services/api';

/**
 * Uploads an image to Cloudinary via the backend API
 * @param file Image file to upload
 * @returns Promise resolving to the uploaded image URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create form data object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Make the API request to the backend endpoint
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Return the image URL from the response
    return response.data.url;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.response?.data?.detail || 'Failed to upload image');
  }
};

/**
 * Create a safe filename from original name
 * @param fileName Original file name
 * @returns Sanitized file name
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove any path components
  const baseName = fileName.split(/[\\/]/).pop() || '';
  
  // Remove special characters and spaces
  return baseName
    .replace(/[^a-zA-Z0-9.]/g, '_')
    .toLowerCase();
}; 