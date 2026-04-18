/**
 * CMS/Blog API Documentation
 * All endpoints with authentication requirements and usage examples
 */

/*
==============================================================================
AUTHENTICATION ENDPOINTS
==============================================================================

1. POST /api/auth/login
   - Body: { email: string, password: string }
   - Response: { success, token, user: { id, email, name, role } }
   - Cookies: admin_token (httpOnly, 7 days)
   - No auth required

2. POST /api/auth/logout
   - Response: { success, message }
   - Clears admin_token cookie
   - No auth required

==============================================================================
ADMIN BLOG MANAGEMENT (Protected - Admin/Editor)
==============================================================================

1. GET /api/admin/blog?page=1&limit=10&status=draft|published
   - List all blog posts (with filters)
   - Response: { data: BlogPost[], total, page, limit, pages }
   - Auth required: Yes (any admin role)

2. POST /api/admin/blog
   - Create new blog post
   - Body: {
       title, slug, excerpt, content (JSON from TipTap),
       featuredImage?, authorName, categories?, tags?,
       status, seoTitle?, seoDescription?, ogImage?, publishedAt?
     }
   - Response: { success, data: BlogPost }
   - Auth required: Yes

3. GET /api/admin/blog/[id]
   - Get specific blog post
   - Response: { success, data: BlogPost }
   - Auth required: Yes

4. PUT /api/admin/blog/[id]
   - Update blog post (all fields except slug are mutable)
   - Body: { same as POST, minus slug }
   - Response: { success, data: BlogPost }
   - Auth required: Yes

5. DELETE /api/admin/blog/[id]
   - Delete blog post
   - Response: { success }
   - Auth required: Yes

6. POST /api/admin/blog/[id]/publish
   - Publish a blog post (change status to published)
   - Response: { success, data: BlogPost }
   - Auth required: Yes

7. POST /api/admin/blog/[id]/unpublish
   - Unpublish a blog post (change status to draft)
   - Response: { success, data: BlogPost }
   - Auth required: Yes

==============================================================================
ADMIN PAGE CONTENT MANAGEMENT (Protected - Admin)
==============================================================================

1. GET /api/admin/pages
   - List all page content records
   - Response: { success, data: PageContent[] }
   - Auth required: Yes (admin only)

2. POST /api/admin/pages
   - Create/upsert page content
   - Body: {
       pageId, heroTitle?, heroSubtitle?, heroImage?,
       mainContent?, sections?, contactEmail?, contactPhone?,
       socialLinks?, seoTitle?, seoDescription?, ogImage?
     }
   - Response: { success, data: PageContent }
   - Auth required: Yes (admin only)

3. GET /api/admin/pages/[pageId]
   - Get specific page content (home|about|services|contact|footer|pricing)
   - Response: { success, data: PageContent }
   - Auth required: Yes (admin only)

4. PUT /api/admin/pages/[pageId]
   - Update specific page content
   - Body: { same editable fields }
   - Response: { success, data: PageContent }
   - Auth required: Yes (admin only)

5. DELETE /api/admin/pages/[pageId]
   - Delete page content
   - Response: { success }
   - Auth required: Yes (admin only)

==============================================================================
ADMIN MEDIA MANAGEMENT (Protected - Admin)
==============================================================================

1. POST /api/admin/media/upload
   - Upload image file
   - Body: FormData with 'file' field
   - Accepted: JPEG, PNG, WebP, GIF (max 5MB)
   - Response: { success, data: { filename, url, size, type } }
   - Auth required: Yes
   - Storage: /public/uploads/[date]/[random-name].[ext]

==============================================================================
PUBLIC BLOG API (No Authentication Required)
==============================================================================

1. GET /api/public/blog?page=1&limit=10
   - List all published blog posts (paginated)
   - Response: { data: BlogPost[], total, page, limit, pages }
   - Auth required: No

2. GET /api/public/blog/[slug]
   - Get single published post by slug
   - Response: { success, data: { post: BlogPost, relatedPosts: BlogPost[] } }
   - Auth required: No

3. GET /api/public/blog/search?q=keyword&limit=10
   - Search published posts by title/excerpt
   - Response: { success, data: { query, results: BlogPost[], count } }
   - Auth required: No

4. GET /api/public/blog/filter?category=Category&page=1&limit=10
   - Filter posts by category
   - Response: { data: BlogPost[], total, page, limit, pages }
   - Auth required: No

5. GET /api/public/blog/filter?tag=tag-name&page=1&limit=10
   - Filter posts by tag
   - Response: { data: BlogPost[], total, page, limit, pages }
   - Auth required: No

==============================================================================
PUBLIC PAGE CONTENT API (No Authentication Required)
==============================================================================

1. GET /api/public/pages
   - Get all page content
   - Response: { success, data: PageContent[] }
   - Auth required: No

2. GET /api/public/pages?pageId=home
   - Get specific page content
   - Response: { success, data: PageContent }
   - Auth required: No

==============================================================================
REQUEST HEADERS
==============================================================================

For authenticated requests, include one of:
1. Authorization: Bearer {token}
   - Pass JWT token in header

2. Cookie: admin_token={token}
   - Automatically set by login endpoint
   - Automatically sent by browser for same-origin requests

==============================================================================
ERROR RESPONSES
==============================================================================

All errors follow this format:
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"  // e.g., UNAUTHORIZED, VALIDATION_ERROR, NOT_FOUND
}

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (e.g., duplicate slug)
- 500: Server Error

==============================================================================
AUTHENTICATION FLOW
==============================================================================

1. Client sends credentials to POST /api/auth/login
2. Server verifies credentials against admin_users collection
3. If valid, server generates JWT token with:
   - sub: user ID
   - email: user email
   - role: "admin" or "editor"
   - iat: issued at timestamp
   - exp: expiration timestamp (7 days)
4. Token returned in response body AND set in httpOnly cookie
5. Client can use token in Authorization header for API calls
6. Server middleware extracts token and verifies signature
7. If valid and not expired, request proceeds; else returns 401

==============================================================================
USAGE EXAMPLE (JavaScript)
==============================================================================

// Login
const loginRes = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    email: "admin@aaronice.com", 
    password: "password123" 
  }),
});
const { token, user } = await loginRes.json();

// Create blog post
const createRes = await fetch("/api/admin/blog", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    title: "My First Post",
    slug: "my-first-post",
    excerpt: "This is my first post",
    content: JSON.stringify({ type: "doc", content: [...] }),
    authorName: "Me",
    status: "published"
  })
});
const { data: post } = await createRes.json();

// Get published posts (public)
const postsRes = await fetch("/api/public/blog?page=1&limit=10");
const { data: posts } = await postsRes.json();

==============================================================================
ENVIRONMENT VARIABLES NEEDED
==============================================================================

In .env.local:

MONGODB_URI=...                    (existing)
MONGODB_DB_NAME=aaronice          (optional, defaults to aaronice)
ADMIN_JWT_SECRET=...              (NEW - 32+ char random string)
ADMIN_DEFAULT_EMAIL=admin@aaronice.com  (NEW)
ADMIN_DEFAULT_PASSWORD=...        (NEW)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  (NEW)

==============================================================================
INITIALIZATION
==============================================================================

On app startup, Phase 1 database initialization will:
1. Connect to MongoDB
2. Create collections and indexes
3. Seed default admin user (if ADMIN_DEFAULT_EMAIL/PASSWORD set)
4. Seed sample blog post (for demo)

This happens automatically - no manual setup needed.

To run migrations manually:
import { initializeDatabase } from "@/lib/db/migrations";
const db = await getDatabase();
await initializeDatabase(db);

*/

// This file is for documentation only
