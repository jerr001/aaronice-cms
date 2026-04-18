# Environment Variables Setup Guide

## Required Variables

Create a `.env.local` file in the project root with the following variables:

### MongoDB Configuration

```env
# MongoDB Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_URI=your_mongodb_connection_string

# Database Name (optional, defaults to 'aaronice')
MONGODB_DB_NAME=aaronice
```

**How to get MongoDB_URI:**

1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Go to "Connect" → "Drivers" → Copy connection string
4. Replace `<username>:<password>` with your database credentials

### JWT Authentication

```env
# JWT Secret for signing tokens
# Use a random 32+ character string
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_JWT_SECRET=your_random_32_char_secret_key_here
```

**Example:**

```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: abc123def456789...
# Use as: ADMIN_JWT_SECRET=abc123def456789...
```

### Default Admin User

```env
# Default admin credentials (created on first app startup)
# Change these after first login!
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=ChangeMe123!
```

**Security Note:** Change the default password immediately after logging in!

### Site Configuration

```env
# Public base URL for the site
# Development: http://localhost:3000
# Production: https://aaronice.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Complete .env.local Example

```env
# Database
MONGODB_URI=mongodb+srv://aaronice:MyPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=aaronice

# Authentication
ADMIN_JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f

# Admin Credentials (change after first login!)
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=ChangeMe123!

# Site
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Other existing variables (keep these from your current setup)
NEXT_PUBLIC_GATEWAY_ID=your_flutterwave_gateway_id
NEXT_PUBLIC_PAYMENT_KEY=your_flutterwave_key
NEXT_PUBLIC_CONTACT_EMAIL=contact@aaronice.com
# ... etc
```

---

## Setup Steps

### 1. Generate JWT Secret

```bash
# On Windows PowerShell
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })) -replace '=+$'
$secret

# On Mac/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Create .env.local

1. In project root, create file: `.env.local`
2. Copy the template above
3. Replace values with your actual credentials
4. Save the file

### 3. Running the App

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000/admin/login
```

The app will automatically:

- ✅ Connect to MongoDB
- ✅ Create indexes
- ✅ Seed default admin user
- ✅ Initialize CMS collections

---

## Security Checklist

- [ ] ADMIN_JWT_SECRET is a strong random string (32+ chars)
- [ ] MONGODB_URI contains real credentials (not placeholder)
- [ ] Default admin password changed after first login
- [ ] .env.local is added to .gitignore (prevents accidental commit)
- [ ] HTTPS enabled in production
- [ ] MongoDB IP whitelist configured in Atlas

---

## Troubleshooting

### "Cannot connect to MongoDB"

**Solution:**

1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas IP whitelist includes your IP
3. Verify database credentials are correct
4. Test connection in MongoDB Compass locally

### "JWT Secret error"

**Solution:**

- Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Update ADMIN_JWT_SECRET in .env.local
- Restart dev server

### "Default admin not created"

**Solution:**

1. Check ADMIN_DEFAULT_EMAIL format is valid email
2. Check logs when app starts
3. Manually create admin via MongoDB:
   ```javascript
   db.admin_users.insertOne({
     email: "admin@aaronice.com",
     password: "hashed_password_here",
     role: "admin",
     createdAt: new Date(),
   });
   ```

### "Port 3000 already in use"

**Solution:**

- Change port: `npm run dev -- -p 3001`
- Or kill process using port 3000

---

## Production Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/aaronice
ADMIN_JWT_SECRET=<strong_random_secret>
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=<strong_password>
NEXT_PUBLIC_BASE_URL=https://aaronice.com
```

### Deployment Checklist

- [ ] All environment variables set in hosting platform
- [ ] HTTPS forced (SSL certificate)
- [ ] MongoDB backups enabled
- [ ] Database credentials securely stored
- [ ] Default admin password changed
- [ ] JWT secret is production-grade strong
- [ ] /public/uploads directory is writable on server
- [ ] Sitemap includes blog posts (auto-generated)

---

## Support

For issues with environment setup:

1. Check MongoDB connection string format
2. Verify all required variables are present
3. Restart dev server after .env.local changes
4. Check node_modules are installed (`npm install`)
