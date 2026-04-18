# Featured Image & Image Upload Guide

## Changes Made

### 1. Removed Image Cropping

Changed from `object-cover` to `object-contain` in all blog display locations:

- ✅ Admin blog editor preview
- ✅ Public blog listing page
- ✅ Public blog detail page
- ✅ Related posts section

**Impact:** Images now display in full without being cropped or cut off.

### 2. Improved Image Component

Updated `components/Blog/BlogFeaturedImage.tsx` with:

- Better error handling with fallback display
- Loading state indicator
- Error message with URL debugging
- Proper image lifecycle management

### 3. Enhanced Admin Blog Editor

Added debug info in the featured image section showing:

- Current featured image URL
- Helps diagnose upload issues

---

## How Image Upload Works

### Upload Flow

```
1. User selects image in admin blog editor
2. File sent to /api/media/upload (unauthenticated route)
   - Saves to: /public/uploads/{timestamp}-{random}-{filename}
   - Returns: { url: "/uploads/..." }
3. URL stored in form state
4. URL sent to /api/admin/blog/[id] when publishing
5. Featured image saved in blog post data
6. Image displayed on public/admin pages
```

### Image Upload Endpoints

**`POST /api/media/upload`** (Public - No Auth)

```javascript
// Request
const formData = new FormData();
formData.append("file", imageFile);
fetch("/api/media/upload", {
  method: "POST",
  body: formData
});

// Response (success)
{
  "success": true,
  "data": {
    "file": {
      "url": "/uploads/1771953336463-d7nk4-photo.png",
      "filename": "1771953336463-d7nk4-photo.png",
      "size": 125456,
      "type": "image/png"
    }
  }
}
```

**`POST /api/admin/media/upload`** (Admin Auth Required)

```javascript
// Alternative endpoint with date-organized folders
// Saves to: /public/uploads/YYYY-MM-DD/{filename}
// Returns: "/uploads/YYYY-MM-DD/{filename}"
```

---

## Image Path Resolution

### File Storage Locations

```
Public uploads (direct endpoint):
  /public/uploads/1771953336463-d7nk4-screenshot__214_.png
  → Access via: /uploads/1771953336463-d7nk4-screenshot__214_.png

Admin uploads (authenticated):
  /public/uploads/2026-02-24/9eb427afaeca10cd.png
  → Access via: /uploads/2026-02-24/9eb427afaeca10cd.png
```

### URL Construction

```javascript
// After upload, URL is returned directly from API
const { data } = await uploadResponse.json();
const imageUrl = data.file.url; // e.g., "/uploads/timestamp-random-name.png"

// This URL is then stored in blog post
blog.featuredImage = imageUrl;

// On display, use the URL directly
<img src={post.featuredImage} alt={post.title} />;
```

---

## Troubleshooting Featured Images

### Issue: Featured image shows as broken (❌)

**Check 1: Image URL in Admin Editor**

- Go to Admin → Blog → Edit Post
- Look for the blue debug box showing the featured image URL
- Should show something like: `/uploads/1771953336463-d7nk4-photo.png`

**Check 2: File Exists**

- Admin editor debug shows the URL
- Use browser DevTools (F12) → Network tab
- Look for the image request URL
- Check if you get HTTP 200 or 404

**Check 3: Featured Image Not Set**

- Open blog post editor
- Section "Featured Image" should have a preview or upload area
- If empty, no featured image is set

**Check 4: Upload Failed Silently**

- Try uploading image again
- Watch browser console for errors
- Check toast notifications (top-right)

### Issue: Image still appears cropped

**Solution:** Images now use `object-contain` instead of `object-cover`

- Cropping has been removed
- Images display in full aspect ratio
- Some whitespace may appear around image depending on container size

---

## Testing Featured Images

### Test Scenario 1: Upload and Save

1. **Go to:** Admin Dashboard → Blog
2. **Click:** "Create New Post" or edit existing
3. **In Featured Image section:**
   - Click upload area or drag-drop image
   - Watch for "Image uploaded successfully" toast
   - Should see image preview
   - Should see URL in blue debug box
4. **Save:** Click "Publish" button
5. **Verify:**
   - Post saves successfully
   - Blue debug box still shows URL
   - Image preview displays
   - Check public blog page `/blog` - image should display

### Test Scenario 2: Check All Locations

After uploading a featured image:

✅ **Admin Editor**

- Featured image preview shows
- Debug URL is visible

✅ **Public Blog List** (`/blog`)

- Post card shows featured image
- No cropping, full image visible

✅ **Public Blog Detail** (`/blog/[slug]`)

- Featured image displays prominently
- Related posts show images

---

## Image Format Support

### Allowed Formats

- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)
- ✅ SVG (.svg) - media/upload only

### Size Limits

- Maximum file size: **5 MB**
- Recommended: Keep under 2 MB for web

### Optimization Tips

- Use PNG for graphics/logos with transparency
- Use JPEG for photographs
- Use WebP for better compression (if browser supports)
- Resize large images before upload (optimal: 1200px wide)

---

## CSS Classes Reference

### Image Container Classes (No Cropping)

```css
/* Now uses object-contain - full image shows */
h-full w-full object-contain

/* Instead of old */
h-full w-full object-cover  /* ❌ This crops images */
```

### Container Sizing

```css
/* Admin editor preview */
h-64                     /* Height: 256px */
w-full                   /* Width: 100% of container */
rounded-lg               /* Rounded corners */
bg-gray-100              /* Light gray background */

/* Public blog detail */
h-80 md:h-96            /* Height: responsive */
w-full                  /* Full container width */
```

---

## Next Steps

### For Better Image Handling

1. ✅ Remove cropping (DONE)
2. Consider lazy loading images
3. Consider image optimization/compression
4. Consider responsive image sizes
5. Add alt text validation

### For Better User Experience

1. ✅ Show featured image URL in debug (DONE)
2. Add image preview before upload
3. Add upload progress bar
4. Add image dimension validation
5. Add automatic image optimization

---

## Browser Console Debugging

To debug featured image loading in browser:

```javascript
// Open DevTools (F12) → Console tab

// Check if image is loading
const img = document.querySelector('img[alt*="Featured"]');
console.log("Image src:", img?.src);
console.log("Image loaded:", img?.complete);
console.log("Image natural size:", img?.naturalWidth, "x", img?.naturalHeight);

// Check for errors
fetch("/uploads/your-filename.png")
  .then((r) => console.log("Status:", r.status))
  .catch((e) => console.log("Error:", e));
```

---

## Final Notes

- All image paths are relative to `/public` folder
- Files uploaded to `/public/uploads/` are served at `/uploads/` URL
- Featured image URL must be set before publishing a post
- Images display at full resolution without aspect ratio cropping
- Use browser DevTools to verify image loading
