# Cloudinary Integration for CasePrepared

This document outlines the implementation of Cloudinary for image uploads in the CasePrepared Admin Dashboard.

## Backend Integration

### Cloudinary Configuration
- Added Cloudinary configuration to `app/core/config.py`
- Added Cloudinary credentials to `.env` file
- Created utilities for image upload in `app/utils/cloudinary.py`

### Image Upload Endpoint
Created a new endpoint `/api/v1/images/upload` that:
- Accepts image files
- Uploads them to Cloudinary
- Returns the image URL and other metadata
- Requires authentication

### Schema Updates
- Created an `ImageUploadResponse` schema to properly format upload responses

## Frontend Integration

The React frontend has been updated to use this new backend endpoint:

### Image Upload Utility
- Created `src/utils/cloudinaryImageUpload.ts` with the `uploadImage` function
- This function sends the image to the backend endpoint, which then uploads to Cloudinary
- Returns the Cloudinary URL to be used in templates

### ImageUploader Component
- Updated the `ImageUploader` component to use the new `uploadImage` function
- Added upload progress indicator
- Handles errors gracefully with user-friendly messages

## How to Use

1. When creating or editing a template, use the ImageUploader component
2. Select an image file (supported formats: JPG, PNG, GIF; max size: 5MB)
3. The component will upload the image to Cloudinary via the backend
4. The image URL will be automatically added to the template form
5. Save the template as usual

## Example API Call

When the frontend uploads an image, it makes a POST request to the backend:

```javascript
// Create form data object to send the file
const formData = new FormData();
formData.append('file', file);

// Make the API request to the backend endpoint
const response = await api.post('/images/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Get the image URL from the response
const imageUrl = response.data.url;
```

The backend will respond with:

```json
{
  "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg",
  "public_id": "sample",
  "format": "jpg",
  "width": 800,
  "height": 600,
  "resource_type": "image"
}
```

The `url` field is then used as the `image_url` in the template data.

## Security Considerations

- The frontend never directly communicates with Cloudinary, ensuring API keys remain secure on the backend
- Authentication is required for image uploads
- File types and sizes are validated both on the frontend and backend
- Images are uploaded to a dedicated Cloudinary account for CasePrepared 