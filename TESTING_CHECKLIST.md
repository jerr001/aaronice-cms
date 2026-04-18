# Testing Checklist - Aaronice Website CMS

Last Updated: March 25, 2026

---

## 🔧 RECENT FIXES & IMPROVEMENTS

- ✅ Added admin authentication middleware (`withAdminAuth`) to all CMS endpoints
  - Courses: GET, POST, PUT, DELETE
  - Team Members: GET, POST, PUT, DELETE
  - Testimonials: GET, POST, PUT, DELETE
  - Pages: Already had authentication (no changes needed)
- ✅ Verified all storage modules have required CRUD methods
- ✅ Verified all API routes have proper error handling
- ✅ Verified data persistence layer is correctly implemented
- ✅ Team member images fixed (now using correct `/images/teams/` path)

---

## ✅ TESTED & CONFIRMED WORKING

### Content Display

- [x] All 9 Courses displaying on homepage
- [x] Course titles, descriptions, prices, durations visible
- [x] Correct course count
- [x] All 5 Team Members displaying
- [x] Team member names and titles showing
- [x] Team member images displaying
- [x] All 4 Testimonials displaying
- [x] Testimonial author names, roles, companies, content visible
- [x] Correct testimonial count
- [x] All static pages displaying (Pages, About, Contact, Pricing, Services, Footer)

### Data Persistence

- [x] Courses persist to `/data/courses.json`
- [x] Team Members persist to `/data/team-members.json`
- [x] Testimonials persist to `/data/testimonials.json`
- [x] Pages persist to `/data/pages.json`
- [x] Data survives server restarts
- [x] Data survives after API init call
- [x] Database initialization completes without errors

### API GET Endpoints

- [x] GET /api/admin/courses - Fetches all courses
- [x] GET /api/admin/team-members - Fetches all team members
- [x] GET /api/admin/testimonials - Fetches all testimonials
- [x] GET /api/admin/pages - Fetches all pages
- [x] GET /api/init - Initializes app and seeds data

### Frontend Features

- [x] Courses component uses cache-busting timestamp
- [x] Team component uses cache-busting timestamp
- [x] Testimonials component uses cache-busting timestamp
- [x] No console errors on page load
- [x] No MongoDB browser module errors

## 📋 IMPORTANT TESTING NOTES

### Authentication Required

All CMS API endpoints now require a valid JWT token in either:

- Authorization header: `Authorization: Bearer <token>`
- Cookie: `admin_token=<token>`

**How to get a token for testing:**

1. You need to have an admin account in the database
2. Login via admin panel to receive JWT token
3. Use that token in Postman/curl/API tests with Bearer scheme

### API Endpoint Locations

- Courses: `/api/admin/courses` and `/api/admin/courses/[id]`
- Team Members: `/api/admin/team-members` and `/api/admin/team-members/[id]`
- Testimonials: `/api/admin/testimonials` and `/api/admin/testimonials/[id]`
- Pages: `/api/admin/pages` and `/api/admin/pages/[pageId]` (note: pageId, not id)

### ID Format Differences

- **Courses:** Numeric IDs created from `Date.now()` (e.g., 1711420800000)
- **Team Members:** String IDs from `Date.now().toString()`
- **Testimonials:** String IDs from `Date.now().toString()`
- **Pages:** String pageIds (predefined: home, about, services, contact, footer, pricing)

---

## 🔄 READY TO TEST - CREATE OPERATIONS

### POST /api/admin/courses

- [ ] Create new course with all required fields
- [ ] Verify course appears in list after creation
- [ ] Verify course persists to disk
- [ ] Test with missing title field (should fail)
- [ ] Test with missing description field (should fail)
- [ ] Test with special characters in course title
- [ ] Test with very long description (>1000 chars)

### POST /api/admin/team-members

- [ ] Create new team member with all required fields
- [ ] Verify team member appears in list after creation
- [ ] Verify team member persists to disk
- [ ] Test with missing name field (should fail)
- [ ] Test with missing title field (should fail)
- [ ] Test with special characters in name

### POST /api/admin/testimonials

- [ ] Create new testimonial with all required fields
- [ ] Verify testimonial appears in list after creation
- [ ] Verify testimonial persists to disk
- [ ] Test with missing author field (should fail)
- [ ] Test with missing content field (should fail)
- [ ] Test with very long testimonial text

### POST /api/admin/pages

- [ ] Create new page with all required fields
- [ ] Verify page persists to disk
- [ ] Test with missing title field (should fail)
- [ ] Test with missing content field (should fail)

---

## 🔄 READY TO TEST - UPDATE OPERATIONS

### PUT /api/admin/courses/[id]

- [ ] Update course title
- [ ] Update course description
- [ ] Update course price
- [ ] Update course duration
- [ ] Update course careers array
- [ ] Verify updated course reflects on frontend after refresh
- [ ] Verify update persists to disk
- [ ] Test updating non-existent course (should return 404)
- [ ] Test with invalid request body

### PUT /api/admin/team-members/[id]

- [ ] Update team member name
- [ ] Update team member title
- [ ] Update team member bio
- [ ] Update team member email
- [ ] Verify updated member reflects on frontend after refresh
- [ ] Verify update persists to disk
- [ ] Test updating non-existent member (should return 404)

### PUT /api/admin/testimonials/[id]

- [ ] Update testimonial author name
- [ ] Update testimonial content
- [ ] Update testimonial role
- [ ] Verify updated testimonial reflects on frontend after refresh
- [ ] Verify update persists to disk
- [ ] Test updating non-existent testimonial (should return 404)

### PUT /api/admin/pages/[id]

- [ ] Update page title
- [ ] Update page content
- [ ] Verify update persists to disk
- [ ] Test updating non-existent page (should return 404)

---

## 🔄 READY TO TEST - DELETE OPERATIONS

### DELETE /api/admin/courses/[id]

- [ ] Delete a course
- [ ] Verify course no longer appears in list
- [ ] Verify deletion persists to disk
- [ ] Verify deletion persists after server restart
- [ ] Test deleting non-existent course (should return 404)

### DELETE /api/admin/team-members/[id]

- [ ] Delete a team member
- [ ] Verify member no longer appears on homepage
- [ ] Verify deletion persists to disk
- [ ] Verify deletion persists after server restart
- [ ] Test deleting non-existent member (should return 404)

### DELETE /api/admin/testimonials/[id]

- [ ] Delete a testimonial
- [ ] Verify testimonial no longer appears in list
- [ ] Verify deletion persists to disk
- [ ] Verify deletion persists after server restart
- [ ] Test deleting non-existent testimonial (should return 404)

### DELETE /api/admin/pages/[id]

- [ ] Delete a page
- [ ] Verify deletion persists to disk
- [ ] Test deleting non-existent page (should return 404)

---

## 🔄 READY TO TEST - END-TO-END WORKFLOWS

### Course Management Workflow

- [ ] Create new course via API
- [ ] Verify it appears on homepage
- [ ] Edit the course (change title, description, price)
- [ ] Refresh homepage - verify changes display
- [ ] Restart development server
- [ ] Verify edited course still has changes
- [ ] Delete the course
- [ ] Verify it no longer appears on homepage
- [ ] Restart server
- [ ] Verify course stays deleted

### Team Member Management Workflow

- [ ] Create new team member via API
- [ ] Verify they appear in team section
- [ ] Edit team member (change name, title, bio)
- [ ] Refresh page - verify changes display
- [ ] Restart development server
- [ ] Verify edited member still has changes
- [ ] Delete the team member
- [ ] Verify they no longer appear
- [ ] Restart server
- [ ] Verify member stays deleted

### Testimonial Management Workflow

- [ ] Create new testimonial via API
- [ ] Verify it appears in testimonials section
- [ ] Edit testimonial (change author, content)
- [ ] Refresh page - verify changes display
- [ ] Restart development server
- [ ] Verify edited testimonial still has changes
- [ ] Delete the testimonial
- [ ] Verify it no longer appears
- [ ] Restart server
- [ ] Verify testimonial stays deleted

---

## 🚀 NOT YET IMPLEMENTED

### Admin Dashboard UI Pages

- [ ] Create Courses CMS admin page
- [ ] Create Team Members CMS admin page
- [ ] Create Testimonials CMS admin page
- [ ] Create Pages CMS admin page
- [ ] Add form validation on frontend
- [ ] Add error handling and user feedback
- [ ] Add loading states during save
- [ ] Add success/error toast notifications

### Additional Features

- [ ] Bulk operations (select multiple and delete)
- [ ] Search/filter functionality in admin
- [ ] Pagination in admin lists (if needed)
- [ ] Image upload for team members
- [ ] WYSIWYG editor for rich text content
- [ ] Auto-save or draft functionality
- [ ] Change history/audit log

---

## 🐛 Known Issues / Edge Cases to Test

- [ ] Special characters in titles (é, ñ, &, etc.)
- [ ] Very long text content (>5000 chars)
- [ ] Rapid successive API calls (race conditions)
- [ ] Cache invalidation after updates
- [ ] Mobile responsiveness of team member images
- [ ] Dark mode image visibility
- [ ] Network timeout scenarios
- [ ] Concurrent edits to same resource

---

## 📊 Testing Progress Summary

**Total Checkboxes:** 175+
**Completed:** ~25
**Remaining:** ~150+

**Completion Percentage:** ~14%

---

## Notes Section

_Use this space to document any testing findings, bugs, or issues discovered:_

```


```

---

**How to use this checklist:**

1. Mark items with `[x]` as you complete testing
2. Document any failures or issues in the Notes section
3. Keep this file updated as you progress
4. Reference specific API endpoints and response codes when testing
