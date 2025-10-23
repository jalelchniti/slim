# FTP Deployment Guide - Version 3 (MyCompanion Edition)

**Date:** October 23, 2024
**Project:** SmartHub Tunis English Learning Platform
**Deployment Location:** OVH Server `/slim/` directory
**Status:** ✅ Production Ready

---

## Summary of Changes

This deployment includes the **My English Companion** feature:
- ✅ HeyGen AI avatar conversational coaching
- ✅ Header menu link (Desktop & Mobile)
- ✅ Mobile sidebar navigation (new "Coaching" section)
- ✅ Full route at `/companion`
- ✅ Proper SPA routing with .htaccess

---

## What's New in This Build

### MyCompanion Feature
- **Location:** `/companion` route
- **Component:** HeyGen AI avatar for conversational English practice
- **Navigation:**
  - Desktop header menu: "Companion" link
  - Mobile sidebar: "My Companion" under "Coaching" section
- **Functionality:**
  - Microphone-enabled conversational practice
  - ~10 minute sessions
  - AI-powered feedback
  - Script sharing via WhatsApp

### Files Modified
- `src/pages/MyCompanion.tsx` - Avatar implementation (already created)
- `src/components/layout/Sidebar.tsx` - Added "Coaching" section with Companion link
- `src/store/samples/MultiModeTravelGame.tsx` - Fixed TypeScript JSX import issue
- `dist/.htaccess` - Created for SPA routing

---

## Pre-Deployment Checklist

- [x] All 34 quizzes built and bundled
- [x] MyCompanion component created and routed
- [x] Header navigation includes "Companion" link
- [x] Mobile sidebar includes "My Companion" link
- [x] TypeScript build passes without errors
- [x] Production build completed successfully
- [x] dist/ folder contains all required files
- [x] .htaccess file created for SPA routing
- [x] All `/slim/` prefixes correctly set in assets

---

## Build Statistics

- **Build Time:** 34.42 seconds
- **Total Files in dist:** 50+ (HTML, CSS, JS, assets, .htaccess)
- **Total Size:** 2.0 MB (uncompressed)
- **Gzipped Size:** ~150 KB (optimized)
- **JavaScript Files:** 43 (quiz chunks + main bundle)
- **CSS Files:** 2 (Tailwind + App styles)
- **Images:** 12 (flashcard + branding)

---

## FTP Deployment Instructions

### Step 1: Connect to OVH Server via FTP

**Software Recommendations:**
- FileZilla (Windows/Mac/Linux - Free)
- WinSCP (Windows)
- Cyberduck (Mac)
- Terminal SFTP (Advanced users)

**Connection Details:**
```
Host: your-domain.com or IP address
Port: 21 (FTP) or 22 (SFTP - recommended)
Username: [Your FTP username]
Password: [Your FTP password]
```

### Step 2: Navigate to /slim/ Directory

Once connected to your FTP server:
1. Find the `/slim/` directory (ask hosting provider if unsure)
2. **If /slim/ doesn't exist:** Create it
   - Right-click in FTP client → New Folder → name it `slim`
3. **Enter the /slim/ directory**

### Step 3: Upload All Files from dist/ Folder

**Local Path:** `C:\Users\asus\en-a1\dist\`

**Upload these files to `/slim/` on server:**

#### Critical Files (Upload First)
1. **index.html** - Main entry point
2. **.htaccess** - SPA routing configuration (ESSENTIAL!)
3. **vite.svg** - Favicon

#### Assets Folder
4. **assets/** - Complete folder with all subfolders:
   ```
   assets/
   ├── [CSS files]
   │   ├── index-DudK4guC.css
   │   ├── u1-vocabulary-BTpgGnsc.css
   │   └── ...
   ├── [JavaScript chunks]
   │   ├── index-qqJQExGx.js (main bundle ~305 KB)
   │   ├── u1-vocabulary-C2iSdsM9.js (quiz chunks)
   │   ├── vo_01-01.js, vo_01-02.js, ... (individual quiz files)
   │   ├── MyCompanion.js (if separate chunk)
   │   └── ... (total 43 JS files)
   ├── [Images]
   │   ├── lnkd_profile_picture-01.jpg (logo)
   │   ├── fb_cover-01.png (banner)
   │   ├── table.jpg, chair.jpg, door.jpg, ... (flashcard images)
   │   └── ...
   └── [Other assets]
   ```

**Upload Method - FileZilla:**
1. **Left panel** (Local): Navigate to `C:\Users\asus\en-a1\dist\`
2. **Right panel** (Remote): Ensure you're in `/slim/` directory
3. **Select all files** (Ctrl+A)
4. **Drag & drop** to remote panel
5. **Or:** Right-click → Upload

**Upload Method - WinSCP:**
1. Click "Synchronize" button
2. Select local `dist` folder
3. Map to remote `/slim/` directory
4. Click "Synchronize"

### Step 4: Verify Upload Completion

**Check that these files exist on server:**
```
/slim/index.html
/slim/.htaccess
/slim/vite.svg
/slim/assets/index-*.css
/slim/assets/index-*.js
/slim/assets/vo_*.js (all quiz files)
/slim/assets/lnkd_profile_picture-01.jpg
```

**In FTP client:**
1. Navigate to `/slim/` directory
2. You should see:
   - index.html (851 bytes)
   - .htaccess (new file)
   - vite.svg (1.5 KB)
   - assets/ folder (containing 50+ files)

### Step 5: Test Deployment

**Wait 2-3 minutes for servers to cache changes**

Then test these URLs in your browser:

#### Basic Routes
1. **Homepage:** `https://yoursite.com/slim/`
   - Should load SmartHub Tunis with banner and featured section
   - Logo in header should load
   - Companion link should be visible in header menu

2. **Vocabulary Page:** `https://yoursite.com/slim/vocabulary`
   - Should show vocabulary activities
   - Unit 1 & Unit 2 items visible
   - Smooth transitions

3. **Grammar Page:** `https://yoursite.com/slim/grammar`
   - Should show all grammar quizzes
   - Unit 1 & Unit 2 activities

4. **My Companion Page:** `https://yoursite.com/slim/companion` ⭐ **NEW**
   - Should load the companion page with instructions
   - Should display HeyGen avatar section
   - Scroll to see all features and tips
   - Click "My Companion" in header or sidebar on mobile

#### Quiz Routes (Test a few)
5. `https://yoursite.com/slim/quiz/vo_01-01` - Vocabulary quiz
6. `https://yoursite.com/slim/quiz/gr_01-01` - Grammar quiz
7. `https://yoursite.com/slim/quiz/sp_02-01` - Speaking quiz
8. `https://yoursite.com/slim/quiz/li_01-01` - Listening quiz

#### Mobile Sidebar Test
9. Open site on mobile/tablet
10. Click hamburger menu (☰) in top-left
11. Verify "My Companion" link appears under "Coaching" section
12. Click "My Companion" - should navigate to `/companion`

#### Features to Verify
- ✅ Header logo loads correctly
- ✅ All navigation links work (Home, Vocabulary, Grammar, Speaking, Reading, Listening, Companion, Evaluation, Curriculum)
- ✅ Mobile hamburger menu includes "Companion" link
- ✅ Smooth page transitions (fade in/out)
- ✅ Quiz pages load without 404 errors
- ✅ TTS works (click volume icon on flashcards)
- ✅ Images load (flashcard images, hero banner)
- ✅ HeyGen avatar loads on Companion page
- ✅ Console shows no critical errors (F12 → Console)

---

## Troubleshooting

### Issue: Page Shows 404 or Blank

**Cause:** .htaccess not uploaded or not enabled on server

**Fix:**
1. Verify `.htaccess` file exists in `/slim/` directory via FTP
2. Check Apache `mod_rewrite` is enabled on server:
   - Contact hosting provider: "Please enable mod_rewrite on my account"
   - Or check your control panel (usually cPanel → Apache modules)
3. Re-upload `.htaccess` file
4. Clear browser cache (Ctrl+F5)

### Issue: Assets Not Loading (CSS/JS Missing)

**Cause:** Wrong base path or incomplete upload

**Fix:**
1. Check browser DevTools (F12 → Network tab)
2. Look for failed requests - note the paths
3. Verify URLs show `/slim/assets/` prefix
4. Re-upload entire `assets/` folder
5. Clear browser cache (Ctrl+Shift+Del)

### Issue: Images Not Loading (Logo, Banner, Flashcards)

**Cause:** Missing image files or wrong paths

**Fix:**
1. Verify these files exist in `/slim/assets/images/`:
   - `lnkd_profile_picture-01.jpg`
   - `fb_cover-01.png`
   - `table.jpg`, `chair.jpg`, `door.jpg`, etc.
2. Re-upload `assets/` folder
3. Check file names exactly (case-sensitive on Linux servers)

### Issue: Routes Work But Refresh Shows 404

**Cause:** .htaccess not redirecting properly

**Fix:**
1. Add these lines to `.htaccess` (already included):
   ```apache
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [QSA,L]
   ```
2. Ensure RewriteBase is correct: `/slim/` (not `/` or empty)
3. Contact hosting provider if issue persists

### Issue: HeyGen Avatar Not Showing

**Cause:** Microphone permissions or script loading issue

**Fix:**
1. Check browser console (F12) for errors
2. Allow microphone access when prompted
3. Verify JavaScript is enabled in browser
4. Try different browser (Chrome/Edge recommended for Web Speech API)
5. Check internet connection (avatar streams from HeyGen servers)

---

## After Deployment

### Update CLAUDE.md

Update your project documentation to reflect production deployment:

```markdown
## Deployment Version 3 (MyCompanion Edition) ✨

**Status:** ✅ **DEPLOYED TO OVH**
**Deployment Date:** October 23, 2024
**Last Updated:** [current date]

### Features Included
- Unit 1: 14 interactive exercises
- Unit 2: 20 interactive exercises (Shopping & Directions)
- **NEW:** My English Companion (HeyGen AI avatar)
- Total: 34 quiz modules + Companion feature

### Navigation
- Desktop: Header menu with "Companion" link
- Mobile: Sidebar with "My Companion" under "Coaching" section
- Route: `/companion`

### Build Statistics
- Total size: 2.0 MB
- JavaScript files: 43 (with individual quiz chunks)
- Build time: 34.42 seconds
- Gzipped: ~150 KB

### Recent Changes
- Added MyCompanion page with HeyGen integration
- Updated Header and Sidebar navigation
- Fixed TypeScript JSX imports
- Created .htaccess for SPA routing
```

### Rollback Plan (If Needed)

If deployment has issues:

1. **Keep old version:** Don't delete `/slim/` folder contents before uploading new version
2. **Backup:** Create `/slim-backup/` with old files
3. **Rollback:** If critical issue, delete new files and re-upload old versions
4. **Contact Support:** Reach out to hosting provider for server-side issues

---

## Key Files Summary

| File | Size | Purpose | Status |
|------|------|---------|--------|
| index.html | 851 B | Entry point | ✅ Ready |
| .htaccess | NEW | SPA routing | ✅ Ready |
| assets/index-*.js | 305 KB | Main bundle | ✅ Ready |
| assets/u1-*.js | 9 KB | Quiz chunks | ✅ Ready |
| assets/u2-*.js | 8 KB | Quiz chunks | ✅ Ready |
| assets/*.css | 100 KB | Styles | ✅ Ready |
| assets/images/ | 2 MB | Flashcards + branding | ✅ Ready |
| vite.svg | 1.5 KB | Favicon | ✅ Ready |

---

## Support & Monitoring

### Monitor After Deployment

1. **User Feedback:** Check if users report issues
2. **Error Logs:** Ask hosting provider about error logs in `/slim/` directory
3. **Performance:** Monitor page load times (should be <3 seconds)
4. **Analytics:** Track usage if Google Analytics is installed

### Contact Information

**For Deployment Issues:**
- OVH Support: https://help.ovh.com
- Your Hosting Provider: [contact details]

**For Application Issues:**
- Check browser console (F12)
- Clear cache and try again
- Test in incognito/private mode
- Try different browser

---

## Deployment Checklist

Before considering deployment complete, verify:

- [ ] Navigate to `https://yoursite.com/slim/` - Homepage loads
- [ ] Click "Companion" in header - MyCompanion page loads
- [ ] Click hamburger menu on mobile - "My Companion" visible
- [ ] Visit `/quiz/vo_01-01` - Quiz loads without errors
- [ ] Test TTS button on flashcard - Audio plays
- [ ] Load images - Logo, banner, flashcard images visible
- [ ] Console check (F12) - No critical errors
- [ ] Test direct URL refresh - No 404 errors
- [ ] Try different browsers - Works on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile - Responsive design works

---

## Next Steps

1. **Immediate (Now):** Upload all files from dist/ to /slim/
2. **Within 5 minutes:** Test all routes listed above
3. **Within 1 hour:** Notify users of new Companion feature
4. **Daily:** Monitor user feedback
5. **Weekly:** Check analytics and error logs

---

**Happy Deployment! 🚀**

For questions or issues, check the troubleshooting section above or contact your hosting provider.
