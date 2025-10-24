# FTP Deployment Guide - Production (Version 2 - Full Content)

**Date**: October 24, 2025
**Build Status**: ✅ Production Ready
**Deployment Target**: OVH Hosting `/slim/` directory
**Total Size**: 2.0 MB uncompressed | ~300 KB core files + assets

---

## Build Summary

**Build Command**: `npm run build`
**Build Time**: ~31 seconds
**Build Output Location**: `C:\Users\asus\en-a1\dist\`

### Build Statistics
- **Total Files**: 59 files
- **Main Bundle**: `index-*.js` (~304 KB)
- **Vocabulary Bundle**: `u1-vocabulary-*.js` (~150 KB)
- **CSS Files**: 2 (index + u1-vocabulary)
- **JavaScript Chunks**: 43 (quiz files + utility chunks)
- **Images**: 12 (flashcard images + branding assets)

### Files Structure
```
dist/
├── index.html                    (0.86 KB) - Main entry point
├── vite.svg                      (1.5 KB) - Favicon
└── assets/
    ├── *.css files              (2 files - ~100 KB total)
    ├── *.js files               (43 files - ~300 KB total)
    ├── images/                  (12 files - branding & flashcards)
    └── .htaccess               (auto-included for SPA routing)
```

---

## Pre-Deployment Checklist

- [x] Build completed successfully with `npm run build`
- [x] No TypeScript errors
- [x] All 34 quizzes compiled and bundled
- [x] MyCompanion avatar script verified (non-duplicated)
- [x] Git changes committed and pushed
- [x] Production build ready in `/dist` folder

---

## FTP Deployment Instructions

### Step 1: Connect to OVH Server

**FTP Connection Details:**
- **Host**: Your OVH FTP hostname (e.g., `ftp.your-domain.com`)
- **Port**: 21 (standard FTP) or 990 (SFTP)
- **Username**: Your OVH FTP username
- **Password**: Your OVH FTP password
- **Target Directory**: `/slim/` (relative to root)

### Step 2: Upload Files

**Method A: Upload Entire Contents of dist/ Folder**

1. Open FTP client (FileZilla, WinSCP, etc.)
2. Connect to OVH server
3. Navigate to `/slim/` directory on server
4. **DO NOT create a new /slim/dist/ folder**
5. Upload **contents** of `C:\Users\asus\en-a1\dist\` to `/slim/`

**Directory Structure After Upload:**
```
/slim/
├── index.html              ← Main entry point
├── vite.svg                ← Favicon
└── assets/
    ├── index-*.css
    ├── u1-vocabulary-*.css
    ├── index-*.js
    ├── u1-vocabulary-*.js
    ├── [43 quiz chunk files *.js]
    └── images/
        ├── flashcard images (8 files)
        └── branding assets (4 files)
```

### Step 3: Verify Deployment

**Test URLs** (after upload completes):

1. **Home Page**: `https://your-domain.com/slim/`
   - Should see hero section, curriculum cards, featured lessons

2. **Vocabulary Page**: `https://your-domain.com/slim/vocabulary`
   - Should list 8 vocabulary items (4 Unit 1 + 4 Unit 2)

3. **Test a Quiz**: `https://your-domain.com/slim/quiz/vo_01-01`
   - Should load Introductions vocabulary flashcard

4. **My Companion**: `https://your-domain.com/slim/companion`
   - Should show avatar centered below instructions
   - Click to test HeyGen avatar functionality

5. **Grammar, Reading, Speaking, Listening** pages
   - All should display full content (8-5 items per page)

---

## Important Configuration Notes

### Base Path Settings (Critical)
These must match for production deployment to work:

**File 1: vite.config.ts**
```typescript
export default defineConfig({
  base: '/slim/',
  // ... rest of config
});
```

**File 2: src/main.tsx**
```typescript
<BrowserRouter basename="/slim">
  <App />
</BrowserRouter>
```

**Both MUST have `/slim/` - if they don't match, routing will fail!**

### SPA Routing (.htaccess)

The build automatically includes `.htaccess` for Apache servers. It handles:
- All route redirects to `index.html`
- Browser history API support
- Static asset caching

If using Nginx, configure:
```nginx
location /slim/ {
  try_files $uri $uri/ /slim/index.html;
}
```

---

## Troubleshooting Deployment Issues

### Issue: 404 on Direct URL Access (e.g., `/slim/vocabulary`)

**Cause**: `.htaccess` not uploaded or not working

**Solution**:
1. Ensure `.htaccess` is in `/slim/` directory
2. Check if server supports `.htaccess` (Apache required)
3. Contact hosting support if .htaccess is ignored

### Issue: Assets Not Loading (CSS/JS 404 errors)

**Cause**: Files uploaded to wrong directory

**Solution**:
1. Verify all files from `dist/assets/` are in `/slim/assets/`
2. Check file names match (Vite adds hashes: `index-abc123.js`)
3. Re-upload `dist/` contents to `/slim/`

### Issue: Images Not Showing

**Cause**: Image paths incorrect

**Solution**:
- All image paths are automatically prefixed with `/slim/` at build time
- No manual path changes needed
- Verify images in `/slim/assets/images/` directory

### Issue: Avatar Not Appearing on /companion Page

**Cause**: HeyGen script injection issue

**Solution**:
1. Check browser console for JavaScript errors
2. Verify MyCompanion.tsx was built correctly
3. Test in Chrome/Edge (best Web Speech API support)
4. Check microphone permissions

---

## File Manifest for FTP Upload

**Total: 59 files**

### Critical Files (Must Upload)
- ✅ `index.html` - Main entry point
- ✅ `assets/index-*.js` - Main application bundle
- ✅ `assets/index-*.css` - Main styles
- ✅ `assets/u1-vocabulary-*.js` - Vocabulary bundle
- ✅ `assets/u1-vocabulary-*.css` - Vocabulary styles
- ✅ All 43 quiz chunk files in `assets/`
- ✅ All image files in `assets/images/`
- ✅ `.htaccess` - SPA routing configuration

### Optional Files
- `vite.svg` - Favicon (can skip, minimal impact)

---

## Post-Deployment Verification

### 10-Point Deployment Checklist

1. **Home page loads**: `https://your-domain.com/slim/`
   - [ ] Hero section displays
   - [ ] Course cards visible
   - [ ] Navigation works

2. **All skill pages accessible**:
   - [ ] `/vocabulary` - Shows 8 items
   - [ ] `/grammar` - Shows 8 items
   - [ ] `/reading` - Shows 8 items
   - [ ] `/speaking` - Shows 5 items
   - [ ] `/listening` - Shows 5 items

3. **Quiz loading**:
   - [ ] `/quiz/vo_01-01` loads flashcard
   - [ ] `/quiz/gr_01-02` loads grammar quiz
   - [ ] `/quiz/re_02-03` loads reading quiz (Unit 2)

4. **My Companion page**:
   - [ ] `/companion` loads with avatar centered
   - [ ] Avatar button clickable
   - [ ] HeyGen iframe initializes

5. **Assets loading**:
   - [ ] CSS applied (styled layout)
   - [ ] JavaScript working (quiz interactions)
   - [ ] Images displaying (flashcard graphics)

6. **No 404 errors**:
   - [ ] Browser console clear
   - [ ] Network tab shows all files loaded
   - [ ] No missing asset errors

7. **Routing works**:
   - [ ] Direct URL access works
   - [ ] Browser back button works
   - [ ] Page transitions smooth

8. **TTS functionality** (on MyCompanion/quizzes):
   - [ ] Speaker icon present
   - [ ] Audio plays on click
   - [ ] Works in Chrome/Edge

9. **Mobile responsive**:
   - [ ] Pages display correctly on mobile
   - [ ] Avatar responsive on mobile
   - [ ] Touch interactions work

10. **Performance**:
    - [ ] Page load time < 3 seconds
    - [ ] Smooth scrolling
    - [ ] No lag on interactions

---

## Rollback Procedure

If deployment fails:

1. **Keep previous `/slim/` backup** before uploading new files
2. **FTP delete** the failing files
3. **Restore** from backup
4. **Test** to verify restoration

---

## Support & Documentation

- **DEPLOYMENT.md** - Detailed FTP guide
- **DEPLOYMENT_READY.md** - Quick checklist
- **FTP_DEPLOYMENT_OVH_GUIDE.md** - OVH-specific instructions
- **CLAUDE.md** - Development guide with troubleshooting section

---

## Build Version Information

**Version**: 2.0 - Full Content (U1 + U2)
**Created**: October 24, 2025
**Content**: 34 interactive quizzes
**Status**: Production Ready ✅
**Last Updated**: October 24, 2025

---

**Deployment Ready!** Upload the contents of `C:\Users\asus\en-a1\dist\` to `/slim/` on your OVH server.
