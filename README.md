# CasePrepared Admin Dashboard

This is the admin dashboard for managing interview templates on the CasePrepared platform.

## Features

- **Authentication**: Admin-only secure login
- **Template Management**: Create, read, update, and delete interview templates
- **Image Upload**: Direct image uploads to Cloudflare Images
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React 19
- TypeScript
- React Router for navigation
- Axios for API communication
- Cloudflare Images for image hosting
- CSS for styling (no UI framework dependencies)

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. The application will be available at `http://localhost:3000`

## Development Environment

- Development API: `http://localhost:8000/api/v1`
- Production API: `https://casepreparedcrud.onrender.com/api/v1`
- Cloudflare Images API is used for image uploads

## Authentication

The application uses JWT token-based authentication. Admin users can log in with their credentials, and their admin status is verified before granting access to the dashboard.

## Project Structure

- `/src/components`: Reusable UI components
  - `/src/components/auth`: Authentication-related components
  - `/src/components/common`: Shared components like ImageUploader
  - `/src/components/layout`: Layout components
  - `/src/components/templates`: Template management components
- `/src/context`: React context providers
- `/src/pages`: Page components
- `/src/services`: API services
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions including image upload helpers

## Image Upload

The application uses Cloudflare Images for image storage. When uploading an image:

1. The file is selected via the ImageUploader component
2. It's uploaded directly to Cloudflare Images API
3. The resulting image URL is saved to the template

## License

This project is proprietary software owned by CasePrepared.
