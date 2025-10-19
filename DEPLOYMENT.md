# FTP Deployment Guide - SmartHub Tunis (English Learning Platform)

## Production Build

The production-ready files are located in the `dist` folder after running:
```bash
npx vite build
```

**Important:** Use `npx vite build` (not `npm run build`) to skip TypeScript strict checking.

## Dist Folder Structure

```
dist/
├── assets/           # All compiled CSS, JS, and media files
│   ├── audios/      # Audio files for TTS exercises
│   ├── images/      # Logo and images (fb_cover-01.png, lnkd_profile_picture-01.jpg, etc.)
│   ├── Videos/      # Video content
│   ├── *.css        # Stylesheets (~94 KB combined)
│   └── *.js         # JavaScript bundles (418 KB main + lazy-loaded quiz chunks)
├── index.html       # Main HTML entry point
└── vite.svg         # Vite logo (optional)
```

## Manual FTP Upload Instructions

### Step 1: Connect to Your FTP Server
Use an FTP client (FileZilla, WinSCP, Cyberduck, etc.) with your hosting credentials:
- Host: Your hosting FTP server
- Username: Your FTP username
- Password: Your FTP password
- Port: 21 (or your hosting provider's FTP port)

### Step 2: Navigate to the /slim Folder
1. Find your public web directory (e.g., `public_html/`, `www/`, `htdocs/`)
2. Navigate to or create the **`/slim`** folder inside your web root
3. Your final path should be: `public_html/slim/` (or equivalent)

### Step 3: Upload Files to /slim Folder
Upload **ALL contents** of the `dist` folder to the `/slim` directory:
1. Upload `index.html` to `/slim/`
2. Upload the entire `assets/` folder to `/slim/`
3. Upload `vite.svg` to `/slim/` (optional)

**Critical Notes:**
- ✅ Upload the CONTENTS of `dist` folder to `/slim/`
- ❌ Do NOT upload the `dist` folder itself
- ✅ Final structure on server: `yoursite.com/slim/index.html` and `yoursite.com/slim/assets/`

### Step 4: Verify Deployment
Visit your domain at: `https://yoursite.com/slim/`

The SmartHub Tunis English Learning Platform should load correctly with:
- SmartHub logo in header
- Hero section with cover banner
- All navigation links working
- Quizzes loading properly

## File Sizes (Reference)

- **Total Bundle Size:** ~580 KB (uncompressed)
- **Gzip Compressed:** ~144 KB
- **CSS:** ~94 KB combined (2 files)
- **JavaScript:** ~418 KB (main bundle) + quiz chunks (2-27 KB each)
- **Images:** ~161 KB (logo + cover image + vocabulary images)

## Important Notes

1. **Base Path:** ✅ The app is configured for `/slim/` deployment in `vite.config.ts`. All asset paths are automatically prefixed with `/slim/`.

2. **Access URL:** Your application will be accessible at: `https://yoursite.com/slim/`

3. **SPA Routing:** This is a Single Page Application using React Router. The server must redirect all `/slim/*` requests to `/slim/index.html` for client-side routing to work.

4. **Cache Busting:** Asset filenames include hash codes (e.g., `index-BHtd54hT.js`) to prevent caching issues after updates.

## Server Configuration (if applicable)

If you have access to server configuration, add this to enable proper SPA routing:

### Apache (.htaccess in /slim folder)
Create a `.htaccess` file inside the `/slim/` folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /slim/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /slim/index.html [L]
</IfModule>
```

### Nginx
Add this to your nginx configuration:
```nginx
location /slim/ {
  try_files $uri $uri/ /slim/index.html;
}
```

## Troubleshooting

**404 Errors on Refresh:**
- Configure server to serve `index.html` for all routes
- Add .htaccess rules (Apache) or nginx config

**Assets Not Loading:**
- Verify `assets` folder uploaded correctly
- Check file permissions (644 for files, 755 for folders)
- Clear browser cache

**Blank Page:**
- Check browser console for errors
- Verify base path configuration
- Ensure all files uploaded successfully

## Re-deployment

When updating the application:
1. Delete old `assets` folder from `/slim/` on server
2. Run `npx vite build` locally
3. Upload new `dist` contents to `/slim/` via FTP
4. Clear browser cache to see changes (or use incognito mode)

## Quick Deployment Checklist

### For /slim Folder (Main Application)
- [ ] Run `npx vite build` to create production build
- [ ] Connect to FTP server
- [ ] Navigate to `/slim/` folder (create if doesn't exist)
- [ ] Delete old `assets` folder from `/slim/`
- [ ] Upload ALL contents from `dist/` to `/slim/`
- [ ] Verify `index.html` is in `/slim/`
- [ ] Verify `assets/` folder is in `/slim/`
- [ ] Verify `.htaccess` is in `/slim/` (included in build)
- [ ] Test site at `https://yoursite.com/slim/`
- [ ] Test navigation between pages
- [ ] Test a quiz to verify lazy loading works

### For Root Level (Landing Page)
- [ ] Upload `dist-root-index.html` to web root as `index.html`
- [ ] This prevents directory listing and provides a welcome page
- [ ] Test root URL `https://yoursite.com/` shows landing page
- [ ] Test "Click here to visit the app" button goes to `/slim/`

## Files Summary

**Upload to `/slim/` folder:**
- All contents from `dist/` folder (index.html, assets/, .htaccess, vite.svg)

**Upload to root `/` (optional but recommended):**
- `dist-root-index.html` renamed as `index.html` (provides welcome/landing page)
