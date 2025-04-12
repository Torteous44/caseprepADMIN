// Cloudflare Image Upload Utility
const CLOUDFLARE_API_KEY = process.env.REACT_APP_CLOUDFLARE_API_KEY || 'Lwbn4YwCte0dHX6FSOU2zPT5ZAI96tgSd5PgmucBr';
const CLOUDFLARE_ACCOUNT_ID = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || '76705939000db54ce780777c3040be60';
const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
const CLOUDFLARE_DELIVERY_URL = process.env.REACT_APP_CLOUDFLARE_DELIVERY_URL || 'https://imagedelivery.net/rJN4vKPotXd2kLUn15yTfw';

/**
 * Step 1: Get a one-time direct upload URL from Cloudflare
 * This needs to be done for each upload
 */
const getDirectUploadUrl = async (): Promise<{ uploadUrl: string, id: string }> => {
  try {
    const response = await fetch(`${CLOUDFLARE_API_URL}/direct_upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minute expiry
        metadata: {
          source: 'caseprepared_admin'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to get upload URL');
    }

    const data = await response.json();
    return {
      uploadUrl: data.result.uploadURL,
      id: data.result.id
    };
  } catch (error) {
    console.error('Error getting direct upload URL:', error);
    throw error;
  }
};

/**
 * Uploads an image to Cloudflare Images using direct creator uploads
 * @param file Image file to upload
 * @returns Promise resolving to the uploaded image URL
 */
export const uploadImageToCloudflare = async (file: File): Promise<string> => {
  try {
    // Step 1: Get a one-time upload URL
    const { uploadUrl, id } = await getDirectUploadUrl();
    
    // Step 2: Upload the file directly to Cloudflare using the one-time URL
    // This doesn't require the API key in the frontend, avoiding CORS issues
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.errors?.[0]?.message || 'Failed to upload image');
    }
    
    // Step 3: Return the image URL using the Cloudflare delivery URL format
    return `${CLOUDFLARE_DELIVERY_URL}/${id}/public`;
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