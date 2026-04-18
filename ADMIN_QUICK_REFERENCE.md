# Admin Quick Reference Card

## 🚀 Getting Started (5 minutes)

### 1. First Time Setup

```bash
# Create .env.local with these values:
MONGODB_URI=your_mongodb_connection_string
ADMIN_JWT_SECRET=generate_random_32_char_string
ADMIN_DEFAULT_EMAIL=admin@aaronice.com
ADMIN_DEFAULT_PASSWORD=ChangeMe123!
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Start the app
npm install
npm run dev

# Visit http://localhost:3000/admin/login
```

### 2. Generate JWT Secret

```bash
# On Mac/Linux:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# On Windows PowerShell:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📝 Creating & Publishing Blog Posts

### Step-by-Step Guide

1. **Login**

   - Go to `/admin/login`
   - Email: `admin@aaronice.com`
   - Password: (your chosen password)

2. **Create New Post**

   - Click "Blog Posts" in sidebar
   - Click "+ New Post" button
   - Fill in form:
     - **Title:** "Understanding AI Automation"
     - **Slug:** Auto-generates from title → "understanding-ai-automation"
     - **Excerpt:** Short 1-2 line summary
     - **Content:** Use rich editor for full post
     - **Featured Image:** Click upload, choose/drag image
     - **Categories:** "AI", "Automation"
     - **Tags:** "ai, machine-learning, business"
     - **SEO Title:** (max 60 chars) "AI Automation Guide | Aaronice"
     - **SEO Description:** (max 160 chars) "Learn how AI automation can transform..."

3. **Save & Publish**

   - Click "Save as Draft" to work later
   - Click "Publish" to make public immediately
   - Post appears on `/blog` page

4. **After Publishing**
   - View on `/blog`
   - Share URL: `https://aaronice.com/blog/understanding-ai-automation`
   - Appears in Google search results (indexed)

---

## 🖼️ Managing Media (Images)

### Upload Images

1. Navigate to **Admin → Media**
2. **Drag & drop** images onto upload area
   - OR click **"Choose Files"** button
3. Wait for upload confirmation
4. Click **"Copy URL"** for the image

### Use Images in Posts

1. While editing blog post content
2. Click **"Image"** button in editor toolbar
3. Paste the copied URL
4. Image appears in post

### Supported Formats

- JPG / JPEG
- PNG
- GIF
- WebP
- Max size: 10MB each

### Example Upload URL

```
/uploads/2024-01-15/how-to-automate-business-workflows.jpg
```

---

## 📄 Editing Existing Posts

### Find & Edit

1. Go to **Admin → Blog Posts**
2. Find post in table
3. Click **"Edit"** in Actions column
4. Make changes
5. Click **"Save All Changes"**

### Publish/Unpublish

1. Go to **Admin → Blog Posts**
2. Click **"Publish"** or **"Unpublish"** in Actions
3. Toggle between draft ↔ published

### Delete Post

1. Go to **Admin → Blog Posts**
2. Click **"Delete"** in Actions
3. Confirm deletion

---

## 🌐 Editing Page Content

### Edit Core Pages

1. Navigate to **Admin → Pages**
2. Click page name in sidebar:

   - Home
   - About
   - Services
   - Contact
   - Footer
   - Pricing

3. Edit fields:

   - **Hero Title:** Main page heading
   - **Hero Subtitle:** Supporting text
   - **Main Content:** Use rich editor
   - **Contact Email:** e@mail.com
   - **Contact Phone:** +234 (0) XXX XXXX XXX

4. Click **"Save All Changes"**

### SEO Settings

For each page:

- **SEO Title:** (max 60 chars)
- **SEO Description:** (max 160 chars)

These appear in Google search results.

---

## 📊 Dashboard Overview

### Quick Stats

When logged in, you see:

- **Total Posts** - All blog posts (draft + published)
- **Published Posts** - Public blog posts
- **Draft Posts** - Private, not yet live
- **Pages** - Editable pages (Home, About, etc)

### Navigation

**Sidebar menu:**

- 🏠 Dashboard (overview & stats)
- 📝 Blog Posts (create, edit, delete)
- 📄 Pages (edit page content)
- 🖼️ Media (upload images)
- 🚪 Logout (exit admin)

---

## 🔑 Admin Tasks Checklist

### Daily/Weekly

- [ ] Review published blog posts
- [ ] Check draft posts for completion
- [ ] Monitor blog comments (if implemented)
- [ ] Update featured content if needed

### Monthly

- [ ] Review blog performance analytics
- [ ] Plan next month's content calendar
- [ ] Check media storage usage
- [ ] Verify all links are working

### Quarterly

- [ ] Review SEO performance
- [ ] Archive old blog posts if needed
- [ ] Update page content for seasonality
- [ ] Plan content initiatives for next quarter

---

## ❌ Common Issues & Solutions

### "Can't login"

- ✅ Check email spelling
- ✅ Verify password (case-sensitive)
- ✅ Ensure MONGODB_URI is correct
- ✅ Restart dev server: `npm run dev`

### "Image won't upload"

- ✅ Image under 10MB?
- ✅ Correct format? (JPG, PNG, GIF, WebP)
- ✅ Public folder has write permissions?
- ✅ Try different browser

### "Post not appearing on /blog"

- ✅ Is it published? (Check status: "published")
- ✅ Wait 30 seconds for cache
- ✅ Clear browser cache (Ctrl+Shift+Delete)
- ✅ Check publishedAt date is today/past

### "Slug URL already exists"

- ✅ Each post slug must be unique
- ✅ Add date or number: "post-name-2024"
- ✅ Auto-slug generates based on title
- ✅ Edit title if slug conflicts

### "Can't see recent changes"

**Solution:** Hard refresh browser

- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 🔐 Security Best Practices

### Password Management

- ✅ Change default password immediately
- ✅ Use strong password (12+ chars, mixed case, numbers)
- ✅ Don't share password via email
- ✅ Use password manager

### Session Management

- ✅ Logout when finished admin work
- ✅ Clear cookies on shared computers
- ✅ Don't use "Remember Me" on public computers
- ✅ Session expires after 7 days

### Data Protection

- ✅ MongoDB backups enabled (check Atlas)
- ✅ Regular content backups (export monthly)
- ✅ Use HTTPS in production
- ✅ Monitor unauthorized login attempts

---

## 💡 Content Tips

### SEO Optimization

**Blog Post Title**

- Include target keyword
- 50-60 characters (fits in search results)
- Make it compelling

**Blog Post Excerpt**

- 1-2 sentence summary
- Appears in /blog listing
- Make readers want to click

**SEO Description**

- Key facts about post
- 150-160 characters
- Include main keyword once
- Appears under title in Google

**Categories & Tags**

- 2-4 categories per post (broad)
- 3-8 tags per post (specific)
- Keep consistent naming
- Helps with internal linking

### Content Quality

- ✅ Write for your audience
- ✅ Use clear headings (H1, H2, H3)
- ✅ Break into short paragraphs
- ✅ Add images for visual interest
- ✅ Include call-to-action at end
- ✅ Proofread before publishing

### Publishing Schedule

- Best days: Tuesday-Thursday
- Best times: 9-11am, 2-4pm
- Post consistently (e.g., weekly)
- Give time for indexing before promotion

---

## 📈 Measuring Success

### Blog Analytics

Track in Google Analytics:

- Page views per post
- Bounce rate
- Average session duration
- Click-through rate (CTR)

### Content Performance

- Which posts get most traffic?
- Which topics engage readers?
- What's your conversion rate?
- Which pages need improvement?

---

## 🔄 Content Calendar Template

**Monthly Planning:**

| Week | Topic                 | Author | Status    | URL              |
| ---- | --------------------- | ------ | --------- | ---------------- |
| 1    | AI Automation Basics  | You    | Draft     | -                |
| 2    | Case Study: Client X  | You    | Published | /blog/case-study |
| 3    | Tutorial: Setup Guide | You    | Draft     | -                |
| 4    | Industry Trends 2024  | You    | Planned   | -                |

---

## 🆘 When Things Go Wrong

### Admin Can't Access

**Problem:** Getting 403 Unauthorized

- Check JWT token hasn't expired
- Clear cookies: Settings → Privacy → Cookies
- Log out and log back in
- Try different browser

### Database Connection Error

**Problem:** "Cannot connect to MongoDB"

- Verify MONGODB_URI contains credentials
- Check IP is whitelisted in MongoDB Atlas
- Verify database name is correct
- Restart dev server

### Blog Post Disappeared

**Problem:** Post was published, now missing

- Check if accidentally unpublished
- Check if deleted (check trash/logs)
- Verify slug didn't change
- Check MongoDB Atlas for data

### Image Upload Failed

**Problem:** Upload button doesn't work

- Check /public/uploads/ folder exists
- Check file size < 10MB
- Check correct file format
- Try smaller test image first

---

## 📞 Quick Support Checklist

Before contacting support:

- [ ] Checked error message carefully
- [ ] Tried restarting server
- [ ] Cleared browser cache
- [ ] Tried different browser
- [ ] Verified .env.local is correct
- [ ] Checked MongoDB connection
- [ ] Restarted computer
- [ ] Checked internet connection

**Support channels:**

1. Check documentation (CMS_IMPLEMENTATION.md)
2. Check ENV_SETUP.md for setup issues
3. Review error logs in terminal
4. Contact development team with error details

---

## 📚 Useful Resources

### Your Files

- [CMS_IMPLEMENTATION.md](CMS_IMPLEMENTATION.md) - Full CMS guide
- [ENV_SETUP.md](ENV_SETUP.md) - Environment setup
- [API_DOCUMENTATION.ts](api/API_DOCUMENTATION.ts) - API reference

### External Resources

- [TipTap Documentation](https://tiptap.dev) - Editor help
- [MongoDB Documentation](https://docs.mongodb.com) - Database
- [Next.js Documentation](https://nextjs.org/docs) - Framework
- [Zod Documentation](https://zod.dev) - Validation

---

## ✅ Task Completion Checklist

### First Time Setup

- [ ] Created .env.local file
- [ ] Generated ADMIN_JWT_SECRET
- [ ] Set MongoDB connection string
- [ ] Set default admin credentials
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Accessed /admin/login successfully
- [ ] Changed default password

### First Blog Post

- [ ] Created blog post with title
- [ ] Added featured image
- [ ] Added categories and tags
- [ ] Filled SEO fields
- [ ] Published post
- [ ] Verified post on /blog page
- [ ] Shared with team

### Ongoing Maintenance

- [ ] Publishing schedule established
- [ ] Content calendar created
- [ ] Analytics tracking set up
- [ ] Backup strategy confirmed
- [ ] Team trained on admin dashboard
- [ ] Documentation reviewed

---

**Last Updated:** 2024
**Status:** Production Ready ✅

For detailed information, see the full [CMS_IMPLEMENTATION.md](CMS_IMPLEMENTATION.md) guide.
