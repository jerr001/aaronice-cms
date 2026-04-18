/**
 * Environment configuration documentation
 * Add these to your .env.local file
 */

/*
=== REQUIRED FOR CMS/BLOG ===

# MongoDB database name (optional, defaults to 'aaronice')
MONGODB_DB_NAME=aaronice

# Admin JWT secret - generate a strong random string (minimum 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Default admin credentials (used to seed the first admin on app startup)
# Once created, you can change password in the admin dashboard
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=ChangeThisPassword123!

# Application base URL (for SEO, links, etc.)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# IMAGE UPLOAD OPTIONS (choose one):

# Option A: Local uploads (default - no setup needed)
# Images stored in /public/uploads/ - works offline

# Option B: Cloudinary (recommended for production)
# Sign up at https://cloudinary.com/
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

=== MONGODB ===
# Already configured in your .env.local
MONGODB_URI=your-mongodb-atlas-connection-string

=== EXISTING (NO CHANGES NEEDED) ===
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=...
MAIL_HOST=...
MAIL_PORT=...
etc.
*/

// This file is for documentation only - no actual code here
