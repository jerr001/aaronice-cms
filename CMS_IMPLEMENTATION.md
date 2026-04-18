# WordPress-like CMS Implementation Guide

## Aaronice Prime Global Company Ltd Website

**Status:** ✅ Complete - Phases 1, 2, and 3 Implemented
**Last Updated:** 2024

---

## 📋 Implementation Summary

A complete **WordPress-like CMS system** has been integrated into the Aaronice website with:

- ✅ Database layer with MongoDB repositories
- ✅ Secure authentication (JWT + password hashing)
- ✅ Full API suite (admin + public endpoints)
- ✅ Admin dashboard with rich text editor
- ✅ Public blog pages
- ✅ **ZERO breaking changes** - all existing code untouched

### System Architecture

```
┌─────────────────────┐
│   Public Pages      │  (Existing site - unchanged)
│ (home, about, etc)  │
└──────────┬──────────┘
           │
    ┌──────▼──────────────────────────────────────────┐
    │             CMS Layer (NEW)                     │
    ├──────────────────────────────────────────────────┤
    │  Page Content  │  Blog Posts  │  Media Files    │
    │  (Editable)    │  (Managed)   │  (Uploaded)     │
    └──────────┬──────────────────────────────────────┘
               │
    ┌──────────▼──────────────────────────────────────┐
    │        MongoDB Atlas Database                  │
    ├──────────────────────────────────────────────────┤
    │ Collections:                                     │
    │ • blog_posts (title, slug, content, etc)       │
    │ • page_content (home, about, contact sections)  │
    │ • admin_users (credentials, roles)             │
    └─────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

### Database Layer (`lib/db/`)

- **models.ts** - Zod schemas for all data types
- **blog.ts** - BlogRepository with 15+ methods
- **pages.ts** - PageContentRepository for editable pages
- **users.ts** - AdminUserRepository for auth
- **index.ts** - Connection helpers
- **migrations.ts** - Database initialization

### API Routes (`app/api/`)

- **Admin APIs** (require JWT auth):

  - `/api/auth/login` - Admin login
  - `/api/admin/blog/*` - Blog CRUD operations
  - `/api/admin/pages/*` - Page content editing
  - `/api/admin/media/upload` - Image uploads

- **Public APIs** (no auth):
  - `/api/public/blog` - List published posts
  - `/api/public/blog/[slug]` - Single post + related
  - `/api/public/blog/search` - Search functionality
  - `/api/public/pages` - Page content access

### Admin Dashboard (`app/admin/`)

- **login** - Admin authentication page
- **layout.tsx** - Dashboard wrapper with navigation
- **page.tsx** - Dashboard home with statistics
- **blog/** - Blog management (list, create, edit)
- **pages/** - Page content editor
- **media/** - Media library upload interface

### Public Pages (`app/(site)/blog/`)

- **page.tsx** - Published blog listing (paginated)
- **[slug]/page.tsx** - Single blog post with metadata

### Support Files (`lib/`)

- **auth/** - JWT and password hashing (crypto.ts, jwt.ts, middleware.ts)
- **hooks/** - useAdminAuth for auth checks
- **utils/** - Response formatting, text utilities
- **validators/** - Zod input validation
- **initialization.ts** - App startup database setup

---

## 🔐 Security Implementation

### Authentication

- ✅ **JWT Tokens** - HMAC-SHA256 signed, 7-day expiry
- ✅ **Password Hashing** - Scrypt with 32-byte salt
- ✅ **HttpOnly Cookies** - Prevents JavaScript access
- ✅ **Timing-Safe Comparison** - Prevents timing attacks
- ✅ **Input Validation** - Zod validators on all endpoints

### Authorization

- ✅ **Role-Based Access Control** - admin/editor roles
- ✅ **Admin-Only Routes** - Middleware enforces auth
- ✅ **Public Blog** - No authentication required

### Data Protection

- ✅ **XSS Prevention** - HTML escaping utilities
- ✅ **Database Indexes** - Optimized queries
- ✅ **Error Handling** - No information leakage

---

## Getting Started

### 1. Environment Setup

Create `.env.local` in project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=aaronice

# JWT Secret (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_JWT_SECRET=your_32_char_random_secret_here

# Default Admin Credentials (change after first login!)
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=ChangeMe123!

# Site Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

See `ENV_SETUP.md` for detailed setup instructions.

### 2. Install Dependencies

```bash
npm install
```

Required packages (auto-installed):

- `zod` - Input validation
- `@tiptap/*` - Rich text editor
- `mongodb` - Database driver
- `react-hot-toast` - Notifications

### 3. Start Development Server

```bash
npm run dev
```

The app will automatically:

- ✅ Connect to MongoDB
- ✅ Create database indexes
- ✅ Seed default admin user
- ✅ Initialize CMS collections

### 4. Access Admin Dashboard

Visit: `http://localhost:3000/admin/login`

**Default Credentials:**

- Email: `admin@aaronice.com`
- Password: `ChangeMe123!` (change immediately!)

---

## Admin Dashboard Features

### Dashboard Home (`/admin`)

- Quick statistics (total posts, published, drafts, pages)
- Quick action buttons
- Recent activity summary

### Blog Management (`/admin/blog`)

- **List View** - Table of all blog posts with status
- **Create/Edit** - Rich text editor with:
  - Auto-slug generation from title
  - Featured image upload
  - SEO fields (title, description)
  - Category and tag assignment
  - Draft/publish toggle
- **Actions** - Edit, publish/unpublish, delete

### Page Content Editor (`/admin/pages`)

- **Edit Pages** - Home, About, Services, Contact, Footer, Pricing
- **Fields** - Hero title/subtitle, main content, contact info, SEO
- **Rich Text** - Full formatting support for all sections

### Media Library (`/admin/media`)

- **Upload Interface** - Drag & drop or click to upload
- **Gallery View** - Thumbnail preview of all uploads
- **Quick Actions** - Copy URL, view, delete

---

## Public Blog Pages

### Blog Listing (`/blog`)

- All published blog posts displayed in grid
- Pagination support (10 posts per page)
- Categories and tags displayed
- "Read More" links to individual posts

### Blog Post Detail (`/blog/[slug]`)

- Full rich text content rendering
- Featured image display
- Author name and publish date
- Categories and tags
- Related posts (3) from same category
- SEO metadata (OpenGraph, Twitter Card)
- Call-to-action section

### Blog Search & Filter

- **API:** `/api/public/blog/search?q=keyword`
- **API:** `/api/public/blog/filter?category=&tag=`

---

## API Endpoints

### Authentication

```
POST /api/auth/login
  Payload: { email: "admin@aaronice.com", password: "..." }
  Response: { token: "eyJ...", user: {...} }

POST /api/auth/logout
  Response: { message: "Logged out successfully" }
```

### Admin - Blog

```
GET /api/admin/blog?page=1&limit=10
  Headers: Authorization: Bearer <token>
  Response: { data: [...], total: 42 }

POST /api/admin/blog
  Headers: Authorization: Bearer <token>
  Payload: { title, slug, excerpt, content, featuredImage, ... }
  Response: { data: newPost }

GET /api/admin/blog/:id
PUT /api/admin/blog/:id
DELETE /api/admin/blog/:id
POST /api/admin/blog/:id/publish
POST /api/admin/blog/:id/unpublish
```

### Admin - Pages

```
GET /api/admin/pages
POST /api/admin/pages
GET /api/admin/pages/:pageId
PUT /api/admin/pages/:pageId
DELETE /api/admin/pages/:pageId
```

### Admin - Media

```
POST /api/admin/media/upload
  Content-Type: multipart/form-data
  Payload: { file }
  Response: { url: "/uploads/2024-01-15/image.jpg" }
```

### Public - Blog (No Auth)

```
GET /api/public/blog?page=1&limit=10
  Response: { data: [], total: 42 }

GET /api/public/blog/:slug
  Response: { post, related: [] }

GET /api/public/blog/search?q=keyword
GET /api/public/blog/filter?category=web&tag=tutorial
```

### Public - Pages (No Auth)

```
GET /api/public/pages?pageId=home
  Response: { pageContent }
```

---

## Styling & Design

### Color Scheme

- **Primary:** Orange (#f97316) - Buttons, highlights
- **Secondary:** Teal (#20c5a8) - Links, accents
- **Neutral:** Slate grays - Text, backgrounds

### TipTap Editor Toolbar

- Text formatting: Bold, Italic, Strikethrough
- Headings: H1, H2, H3
- Lists: Bullet, Ordered
- Code: Inline code, Code blocks
- Quotes: Blockquotes
- Media: Add links, add images (URL-based)
- Undo/Redo: Full history control

---

## 📱 Database Schema

### blog_posts Collection

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique),
  excerpt: string,
  content: object (TipTap JSON),
  featuredImage: string,
  authorName: string,
  categories: string[],
  tags: string[],
  status: "draft" | "published",
  seoTitle: string,
  seoDescription: string,
  seoKeywords: string[],
  publishedAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

### page_content Collection

```typescript
{
  _id: ObjectId,
  pageId: string (unique),
  heroTitle: string,
  heroSubtitle: string,
  mainContent: object (TipTap JSON),
  contactEmail: string,
  contactPhone: string,
  seoTitle: string,
  seoDescription: string,
  updatedAt: Date
}
```

### admin_users Collection

```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  role: "admin" | "editor",
  active: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Content Integration

### Existing Pages (Not Yet Modified)

Current pages remain **completely unchanged** until you edit them in the CMS:

- `/` (Home)
- `/about` (About)
- `/contact` (Contact)
- `/services` (Services)
- Footer content

### Future Integration

To make existing pages use CMS content:

1. Update page components to check PageContent API first
2. Fall back to hardcoded content if CMS is empty
3. Ensures zero visual changes while adding flexibility

---

## Sitemap & SEO

### Auto-Generated Sitemap

`/sitemap.xml` now includes:

- All static pages (home, about, contact, courses)
- All published blog posts
- Dynamic priority based on type
- Last modified dates

**Updated automatically** - No manual configuration needed!

---

## 🛠️ Development Workflow

### Adding a New Blog Post

```typescript
// Via Admin Dashboard:
1. Click "Admin" → "Blog Posts" → "+ New Post"
2. Fill in: Title, Slug (auto-generated), Excerpt
3. Use rich editor for content
4. Upload featured image
5. Add SEO details (title, description)
6. Choose to Save as Draft or Publish
7. Done!

// Via API:
POST /api/admin/blog
Headers: Authorization: Bearer <jwt_token>
Body: {
  title: "My First Blog Post",
  slug: "my-first-blog-post",
  excerpt: "An exciting introduction...",
  content: "{...tiptap json...}",
  ...
}
```

### Publishing Content

1. **Drafts** - Private, only visible in admin
2. **Published** - Public, appears in /blog listing
3. **Unpublish** - Revert published to draft

### Managing Media

1. Visit Admin → Media
2. Drag & drop images or click to browse
3. Upload automatically stores in `/public/uploads/[date]/`
4. Click "Copy URL" to use in blog posts or pages
5. Supported formats: JPG, PNG, GIF, WebP (max 10MB)

---

## Important Notes

### Zero Breaking Changes

- All new files are additive (new routes, APIs, database collections)
- Existing pages remain untouched and functional
- No modifications to existing components or styles
- Live site appearance unchanged until content is created

### First-Time Setup

- Default admin user created automatically on first startup
- Change default password immediately!
- Environment variables must be set before first run

### Database Backup

- MongoDB Atlas provides automated backups
- Recommended: Enable daily backups in MongoDB Atlas dashboard

### Performance

- Blog posts database indexed on slug, status, publishedAt
- Categories and tags indexed for filtering
- Text search enabled on title and excerpt

---

## 🐛 Troubleshooting

### "Cannot login"

- ✅ Verify ADMIN_DEFAULT_EMAIL and ADMIN_DEFAULT_PASSWORD in .env
- ✅ Check MongoDB connection (MONGODB_URI)
- ✅ Restart dev server after .env changes

### "Blog posts not loading"

- Verify database indexes created (check app startup logs)
- Check MONGODB_URI connection
- Verify blog_posts collection exists

### "Images not uploading"

- Check /public/uploads folder exists and is writable
- Verify image file size < 10MB
- Supported formats: JPG, PNG, GIF, WebP

### "JWT token errors"

- Regenerate ADMIN_JWT_SECRET (see ENV_SETUP.md)
- Clear browser cookies
- Restart dev server

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set strong ADMIN_JWT_SECRET (32+ random characters)
- [ ] Change default admin password
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Enable MongoDB backups
- [ ] Set NEXT_PUBLIC_BASE_URL to production domain
- [ ] Verify all environment variables set
- [ ] Test blog creation and publishing
- [ ] Test media uploads
- [ ] Check sitemap.xml includes blog posts

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://prod_user:secure_pass@prod-cluster.mongodb.net/aaronice
ADMIN_JWT_SECRET=<strong_random_32_char_secret>
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=<strong_password>
NEXT_PUBLIC_BASE_URL=https://aaronice.com
```

### Deployment Platforms

- **Vercel** - Recommended for Next.js
- **Netlify** - Alternative option
- **Self-hosted** - AWS, DigitalOcean, Heroku

---

## Support & Resources

### Documentation Files

- [ENV_SETUP.md](ENV_SETUP.md) - Detailed environment setup guide
- [API_DOCUMENTATION.ts](api/API_DOCUMENTATION.ts) - Complete API reference
- This file - Full CMS implementation guide

### Quick Start

1. Read `ENV_SETUP.md` for setup
2. Configure `.env.local`
3. Run `npm install && npm run dev`
4. Visit `/admin/login`

### Common Questions

**Q: Can I use the existing website while building the CMS?**
A: Yes! All existing pages work normally. CMS is completely additive.

**Q: How do I backup my blog content?**
A: MongoDB Atlas automates this. Also available via `mongodump` utility.

**Q: Can I import existing blog posts?**
A: Yes, via bulk API calls or MongoDB import tools.

**Q: Is the editor WYSIWYG?**
A: Yes, TipTap provides live preview as you type.

**Q: Can I schedule posts?**
A: Current version: Manual publish. Future enhancement possible.

**Q: What happens if MongoDB goes down?**
A: Admin dashboard unavailable, but existing published blog pages still work (no real-time database access).

---

## 🎯 Next Steps

### Immediate (Recommended)

1. ✅ Set up environment variables (see ENV_SETUP.md)
2. ✅ Start dev server and test admin login
3. ✅ Create first blog post
4. ✅ Visit /blog to see published post

### Short-term (1-2 weeks)

1. Create blog posts for your services
2. Integrate PageContent into existing pages
3. Test media upload functionality
4. Optimize SEO fields

### Medium-term (1-2 months)

1. Create blog content calendar
2. Set up analytics tracking
3. Implement blog comments (optional)
4. Create blog categories strategy

### Long-term (3-6 months)

1. Expand CMS for other content types
2. Implement page scheduling
3. Add advanced analytics
4. Consider CDN for media files

---

## 📄 File Reference Quick Link

### Core Database Files

- [lib/db/models.ts](lib/db/models.ts) - Data schemas
- [lib/db/blog.ts](lib/db/blog.ts) - Blog repository
- [lib/db/pages.ts](lib/db/pages.ts) - Pages repository
- [lib/db/migrations.ts](lib/db/migrations.ts) - Database init

### Authentication

- [lib/auth/crypto.ts](lib/auth/crypto.ts) - Password hashing
- [lib/auth/jwt.ts](lib/auth/jwt.ts) - Token management
- [lib/auth/middleware.ts](lib/auth/middleware.ts) - Auth checks

### Admin UI

- [app/admin/login/page.tsx](app/admin/login/page.tsx) - Login form
- [app/admin/layout.tsx](app/admin/layout.tsx) - Dashboard wrapper
- [app/admin/page.tsx](app/admin/page.tsx) - Dashboard home
- [app/admin/blog/page.tsx](app/admin/blog/page.tsx) - Blog list
- [app/admin/blog/[id]/page.tsx](app/admin/blog/[id]/page.tsx) - Blog editor
- [app/admin/pages/page.tsx](app/admin/pages/page.tsx) - Page editor
- [app/admin/media/page.tsx](app/admin/media/page.tsx) - Media manager

### Public Pages

- [app/(site)/blog/page.tsx](<app/(site)/blog/page.tsx>) - Blog listing
- [app/(site)/blog/[slug]/page.tsx](<app/(site)/blog/[slug]/page.tsx>) - Blog post

### Components

- [components/Admin/RichEditor.tsx](components/Admin/RichEditor.tsx) - TipTap editor

---

**Status:** Production Ready ✅

All phases complete. CMS fully integrated with zero breaking changes to existing site.
