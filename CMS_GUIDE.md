# Aaronice CMS - User Guide

## Overview

This is a WordPress-like Content Management System (CMS) integrated into the Aaronice website. It allows administrators to manage blog posts, page content, and media files without touching code.

**Key Features:**

- ✅ Full-featured blog management (create, edit, publish, delete)
- ✅ Rich text editor with TipTap (bold, italic, headings, lists, links, images)
- ✅ Media library with drag-and-drop uploads
- ✅ Editable page content (home, about, contact, footer, etc.)
- ✅ SEO optimization for all content
- ✅ Secure authentication with JWT tokens
- ✅ Zero breaking changes to existing site

---

## Getting Started

### 1. Environment Setup

Add these variables to your `.env.local` file:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=aaronice

# JWT Authentication
ADMIN_JWT_SECRET=your_random_32_char_secret_key_here

# Default Admin User (created on first startup)
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=ChangeMe123!

# Site Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:** Change the default admin password immediately after first login!

### 2. First Launch

When you start the app for the first time:

1. Database indexes are created automatically
2. Default admin user is seeded with credentials from env vars
3. Collections created: `blog_posts`, `page_content`, `admin_users`

### 3. Accessing the Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. You're redirected to `/admin` dashboard

---

## Dashboard Overview

### Layout

```
┌─────────────────────────────────────┐
│         ADMIN DASHBOARD             │
├─────────┬─────────────────────────┤
│         │                         │
│ Sidebar │    Main Content Area    │
│         │                         │
│ • Blog  │    (Stats / Forms)      │
│ • Pages │                         │
│ • Media │                         │
│         │                         │
└─────────┴─────────────────────────┘
```

---

## Blog Management

### Create a Blog Post

1. Click **"Blog"** in sidebar → **"New Post"** button
2. Fill in the form:

   - **Title**: Post title (auto-generates slug)
   - **Featured Image**: Upload or paste URL
   - **Excerpt**: Short summary (used in listings)
   - **Content**: Write using the rich editor
   - **Author**: Your name
   - **Categories**: Select or create (comma-separated)
   - **Tags**: Enter tags (comma-separated)

3. **SEO Section**:

   - **Meta Title** (60 chars): What appears in search results
   - **Meta Description** (160 chars): Preview in search results
   - **Featured Image URL**: For social sharing

4. **Publish Options**:
   - **Save as Draft**: Keep unpublished (only visible to admins)
   - **Publish**: Make public immediately
   - **Schedule** (future): Set publish date

### Edit a Blog Post

1. Go to **Blog** → Find your post in the table
2. Click **Edit** button
3. Update fields and click **Update**
4. Changes are saved immediately

### Publish/Unpublish

- In the blog list, click **Publish** to make public
- Click **Unpublish** to hide from public (remains in drafts)

### Delete a Blog Post

1. Click the **Delete** button in the blog list
2. Confirm deletion (cannot be undone)

---

## Page Content Management

### Editable Pages

These pages can have their content managed via CMS:

- **Home** - Hero section and main content
- **About** - About page content
- **Services** - Services/pricing information
- **Contact** - Contact information and details
- **Footer** - Footer content and links
- **Pricing** - Pricing page content

### Edit Page Content

1. Click **Pages** in sidebar
2. Select a page from the list (e.g., "Home")
3. Update fields:

   - **Hero Title**: Main heading
   - **Hero Subtitle**: Subheading
   - **Main Content**: Rich text content
   - **Contact Email**: Contact email for this page
   - **Contact Phone**: Phone number
   - **SEO Fields**: Title and description for search engines

4. Click **Save Changes** to update

### Content Hierarchy

If a page has CMS content configured, it displays that. Otherwise, it falls back to the hardcoded version. This ensures **zero downtime** - you can update pages gradually.

---

## Media Library

### Upload Images

1. Click **Media** in sidebar
2. **Drag & drop** images OR click **"Choose Files"**
3. Supported formats: JPG, PNG, GIF, WebP
4. Max file size: 10MB per image

### Manage Media

In the media grid, each image shows:

- Thumbnail preview
- File name and size
- Upload date
- **Copy URL**: Copy to clipboard (use in blog editor)
- **View**: Open in new tab

### Using Media in Blog Posts

1. In the rich editor content field, click **Add Image** icon
2. Paste the image URL (copied from Media library)
3. Image renders in editor and on published post

---

## Rich Text Editor

The editor toolbar provides:

| Icon      | Function      | Shortcut |
| --------- | ------------- | -------- |
| **B**     | Bold          | Ctrl+B   |
| **I**     | Italic        | Ctrl+I   |
| **U**     | Underline     | Ctrl+U   |
| **S**     | Strikethrough | -        |
| **H1-H3** | Headings      | -        |
| **•**     | Bullet list   | -        |
| **1.**    | Numbered list | -        |
| **<>**    | Code block    | -        |
| **"**     | Blockquote    | -        |
| **🔗**    | Add link      | -        |
| **🖼**    | Add image     | -        |
| **↶**     | Undo          | Ctrl+Z   |
| **↷**     | Redo          | Ctrl+Y   |

### Editor Tips

- **Links**: Select text → click link icon → enter URL
- **Images**: Click image icon → paste URL → Enter
- **Code blocks**: Use for code examples (maintains formatting)
- **Markdown**: Editor saves as JSON (portable, not Markdown)

---

## SEO Optimization

### For Blog Posts

1. **Meta Title** (60 characters):

   - Should include primary keyword
   - Be compelling for clicks
   - Example: "AI Automation Tools 2024 | Complete Guide"

2. **Meta Description** (160 characters):

   - Summary of post content
   - Should include call-to-action
   - Example: "Learn how AI automation tools can save your business 10+ hours weekly. Our complete guide covers top tools, setup, and best practices."

3. **Featured Image**:
   - High quality (1200x630px recommended)
   - Relevant to post topic
   - Good for social media sharing

### For Pages

Each page has SEO settings. These appear in:

- Google search results (title & description)
- Social media preview
- Browser tab

### Best Practices

- ✅ Include keywords naturally
- ✅ Front-load important keywords
- ✅ Keep titles unique per page
- ✅ Write compelling descriptions
- ✅ Use high-quality images
- ✅ Link to related blog posts (use categories)

---

## Workflows

### Publishing a Blog Post

```
Draft → Review → Set publish date → Publish → Social share → Done
```

### Content Updates

1. **Update page content**:

   - Go to Pages → Select page → Edit → Save
   - Changes live immediately

2. **Update blog post**:
   - Go to Blog → Click Edit → Update → You choose to re-publish

### Backup Best Practices

- CMS stores everything in MongoDB
- Database backups: Use MongoDB Atlas backup features
- Media files: Automatically saved to `/public/uploads/`
- Recommendation: Enable MongoDB automatic backups

---

## Troubleshooting

### Can't Login

- **Issue**: "Invalid credentials"
- **Solution**:
  - Check ADMIN_DEFAULT_EMAIL in `.env.local`
  - Verify password: Check .env.local ADMIN_DEFAULT_PASSWORD
  - Or reset via database: Delete admin user and restart

### Blog post not showing publicly

- **Issue**: Post created but not visible on `/blog`
- **Solution**: Check if post is **Published** (not Draft)
- Verify: Status = "published" in blog list

### Uploaded images not showing

- **Issue**: Images uploaded but broken links in editor
- **Solution**:
  - Check image URL format: `/uploads/2024-01-15/filename.jpg`
  - Verify file exists in `/public/uploads/`
  - Try re-uploading

### Database connection error

- **Issue**: "Failed to connect to database"
- **Solution**:
  - Verify MONGODB_URI in `.env.local`
  - Check MongoDB Atlas IP whitelist
  - Ensure database exists
  - Test connection string independently

### Styling issues in rich editor

- **Issue**: Rich editor colors don't match site theme
- **Solution**: Update RichEditor.tsx editor colors
- Located in: `/components/Admin/RichEditor.tsx`

---

## API Reference

### Public Blog API

```bash
# Get all published posts (paginated)
GET /api/public/blog?page=1&limit=10

# Get single post by slug
GET /api/public/blog/my-blog-title

# Search posts
GET /api/public/blog/search?q=keyword

# Filter by category/tag
GET /api/public/blog/filter?category=AI&tag=automation
```

### Admin Blog API (Requires Auth)

```bash
# List all posts (admin)
GET /api/admin/blog

# Create post
POST /api/admin/blog
Content-Type: application/json
{
  "title": "My Post",
  "excerpt": "...",
  "content": "...",
  "featuredImage": "url",
  "categories": ["AI"],
  "tags": ["automation"]
}

# Update post
PUT /api/admin/blog/:id

# Delete post
DELETE /api/admin/blog/:id

# Publish/unpublish
POST /api/admin/blog/:id/publish
POST /api/admin/blog/:id/unpublish
```

### Authentication

```bash
# Login
POST /api/auth/login
{
  "email": "admin@aaronice.com",
  "password": "password"
}

# Response includes:
{
  "token": "jwt_token",
  "user": { "id": "...", "email": "..." }
}

# Logout
POST /api/auth/logout
```

---

## Security

### Password Security

- Passwords hashed with Scrypt (industry standard, not plain text)
- Never transmitted over HTTP (HTTPS only in production)
- Change default password on first login

### JWT Tokens

- Tokens expire after 7 days
- Stored in httpOnly cookies (safe from XSS)
- Signed with HMAC-SHA256

### Input Validation

- All inputs validated on server-side
- XSS prevention via HTML escaping
- SQL injection: Not applicable (MongoDB, not SQL)

---

## Performance Tips

### For Fast Blog Loading

1. **Optimize featured images**:

   - Compress before upload (max 500KB)
   - Use WebP format when possible
   - Size: 1200x630px

2. **Keep content concise**:

   - Use headings to break up text
   - Limit to 2000-3000 words
   - Use bullet lists for clarity

3. **Category organization**:
   - Limit to 5-10 categories
   - Use consistent naming
   - Improves user navigation

---

## Future Enhancements

Planned features (not yet implemented):

- [ ] Analytics dashboard (post views, search rankings)
- [ ] Comments on blog posts
- [ ] Email notifications on new posts
- [ ] Advanced image optimization (Cloudinary integration)
- [ ] Blog post scheduling UI
- [ ] Batch operations (publish multiple posts)
- [ ] User roles (editor, author, admin)
- [ ] Content revision history

---

## Support & Troubleshooting

**Common Issues**: See **Troubleshooting** section above

**For development questions**:

1. Check API documentation in `API_DOCUMENTATION.ts`
2. Review database schemas in `lib/db/models.ts`
3. Check component implementations in `components/Admin/`

**To report bugs**:

1. Document steps to reproduce
2. Check browser console for errors
3. Review network tab (API calls)
4. Include environment details (Node version, DB, etc.)

---

## Database Retention

- Blog posts: Stored indefinitely in MongoDB
- Media files: Kept in `/public/uploads/` until manually deleted
- Admin users: Retained for security audit log
- Old sessions: Non-persistent (JWT-based, no session table)

---

## Conclusion

The CMS is designed to be **intuitive**, **secure**, and **zero-breaking-changes**. You can update all site content without touching code.

**Happy content creation!** 🚀
