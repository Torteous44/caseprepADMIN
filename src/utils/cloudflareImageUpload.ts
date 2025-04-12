// Cloudflare Image Upload Utility
const CLOUDFLARE_API_KEY = 'Lwbn4YwCte0dHX6FSOU2zPT5ZAI96tgSd5PgmucBr';
const CLOUDFLARE_ACCOUNT_ID = '76705939000db54ce780777c3040be60';
const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

/**
 * Uploads an image to Cloudflare Images
 * @param file Image file to upload
 * @returns Promise resolving to the uploaded image URL
 */
export const uploadImageToCloudflare = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add optional metadata
    const metadata = {
      filename: sanitizeFileName(file.name),
      source: 'caseprepared_admin'
    };
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await fetch(CLOUDFLARE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to upload image');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to upload image');
    }
    
    // Return the image URL from Cloudflare
    // This will return the first variant (typically the default URL)
    return data.result.variants[0];
  } catch (error) {
    console.error('Error uploading image to Cloudflare:', error);
    throw error;
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