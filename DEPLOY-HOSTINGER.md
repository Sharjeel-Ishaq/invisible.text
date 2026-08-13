# Hostinger Deployment Guide - Invisible Text App

## ⚠️ CRITICAL INFORMATION

This is a **full-stack application** with a React frontend and Express backend. **Hostinger's standard shared hosting cannot run the Node.js backend.**

### Deployment Options:

1. **Frontend-only (Static)** ✅ Works on Hostinger shared hosting
   - Deploy only the React app to `public_html/`
   - Backend APIs (`/api/*`) will NOT work
   - Use for non-dynamic features (text generators, converters, etc.)

2. **Full-stack** ❌ Requires Node.js hosting
   - Need Hostinger VPS or dedicated server with Node.js runtime
   - OR use alternative hosting (Heroku, Railway, Render, Replit, etc.)

---

## DEPLOYMENT ARCHITECTURE

### Frontend
- **Framework:** React 19 + Vite
- **Type:** Single-Page Application (SPA)
- **Build Output:** `Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public/`
- **Hostinger Root:** `public_html/`

### Backend
- **Framework:** Express.js (Node.js)
- **Type:** REST API
- **Requires:** Node.js runtime
- **Cannot run on:** Standard Hostinger shared hosting
- **Can run on:** Hostinger VPS, dedicated server, or alternative platforms

### Frontend/Backend Communication
```
Browser (Frontend)
    ↓
/api/* fetch requests
    ↓
Backend Express Server (NOT available on Hostinger shared hosting)
```

---

## FRONTEND-ONLY DEPLOYMENT (Hostinger Shared Hosting)

### Step 1: Build the Frontend

```bash
# Navigate to project root
cd /path/to/Invisible-Text-App

# Install dependencies (first time only)
pnpm install

# Build frontend only
cd Invisible-Text-WebApp/artifacts/invisible-webapp
pnpm run build

# Output: dist/public/
```

### Step 2: Deploy to Hostinger

**Manual Upload via cPanel/FTP:**

1. Delete all files from `public_html/`
2. Upload all files from `Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public/` to `public_html/`
3. Verify `.htaccess` is in `public_html/`

**Expected Structure:**
```
public_html/
├── index.html
├── assets/
│   ├── index-*.css
│   ├── index-*.js
│   └── ...
├── .htaccess
├── robots.txt
├── sitemap.xml
├── ads.txt
├── favicon.png
└── images/
```

### Step 3: Verify Deployment

1. Visit your domain: `https://yourdomain.com/`
2. Test SPA routing:
   - `/` should work ✓
   - `/unicode-text-converter` should work ✓
   - `/admin/login` should work ✓
3. Verify static assets load (CSS, JS, images)
4. Check browser console for errors

### Step 4: API Routes Will NOT Work

**⚠️ Important:** Without the backend, these features will fail:
- Blog functionality (requires database)
- Admin dashboard (requires backend)
- Contact form submissions
- Any features requiring `/api/*` calls

**Frontend-only features that work:**
- Text generators (Free Fire text, Reverse text, etc.)
- Unicode converter
- Text spacer
- Mirror text generator

---

## AUTOMATED DEPLOYMENT SCRIPT

The repository includes `scripts/deploy-hostinger.js` for automated deployment:

```bash
# Run from project root
npm run deploy:hostinger

# Or manually:
node ./scripts/deploy-hostinger.js
```

This script:
1. Cleans build artifacts
2. Builds all packages
3. Removes old `public_html/`
4. Copies `Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public/` to `public_html/`

---

## BUILD COMMANDS

### Build Everything
```bash
pnpm install
pnpm build
```

### Build Frontend Only
```bash
cd Invisible-Text-WebApp/artifacts/invisible-webapp
pnpm install
pnpm run build
# Output: dist/public/
```

### Build Backend Only (requires Node.js hosting)
```bash
cd Invisible-Text-WebApp/artifacts/api-server
pnpm install
pnpm run build
# Output: dist/index.mjs
```

### Development Frontend
```bash
cd Invisible-Text-WebApp/artifacts/invisible-webapp
pnpm run dev
# Runs on http://localhost:5000 (or PORT env var)
```

### Development Backend
```bash
cd Invisible-Text-WebApp/artifacts/api-server
pnpm run dev
# Runs on http://localhost:3000 (or PORT env var)
```

---

## ENVIRONMENT VARIABLES

### Frontend Build
```bash
BASE_PATH=/  # Base URL path (use "/" for domain root)
```

### Backend (if running on Node.js hosting)
```bash
PORT=3000                    # Server port
NODE_ENV=production          # Environment
SESSION_SECRET=your_secret   # Session encryption key
ALLOWED_ORIGINS=yourdomain.com  # CORS allowed origins
DATABASE_URL=               # PostgreSQL connection string
```

---

## .HTACCESS CONFIGURATION

**Location:** `public_html/.htaccess`

**Purpose:**
- Enable Apache mod_rewrite
- Route all non-file/non-directory requests to `index.html`
- Enables SPA client-side routing
- Adds security headers
- Configures caching

**Already included in repository.** Verify it's not empty before deployment.

---

## TROUBLESHOOTING

### 403 Forbidden Error

**Cause 1: Missing/empty `.htaccess`**
```bash
# Check if .htaccess exists and is not empty
ls -la public_html/.htaccess
wc -l public_html/.htaccess  # Should have > 0 lines
```
**Fix:** Copy `.htaccess` from repository to `public_html/`

**Cause 2: Apache mod_rewrite not enabled**
- Contact Hostinger support
- Request Apache `mod_rewrite` to be enabled
- May need to enable via cPanel if available

**Cause 3: Wrong document root**
- Verify Hostinger document root is `public_html/`
- NOT `public_html/invisible-webapp/` or similar
- Confirm in cPanel > Addon Domains or Main Domain

### 404 on SPA Routes

**Example:** `/admin/login` returns 404

**Cause:** `.htaccess` missing or not working

**Fix:**
1. Verify `.htaccess` is in `public_html/`
2. Verify it contains rewrite rules
3. Check Apache error logs (contact Hostinger)
4. Ensure `RewriteEngine On` is enabled

### Assets Not Loading

**Causes:**
1. Wrong Vite `base` configuration
2. Assets in wrong directory
3. MIME types not recognized

**Fix:**
1. Verify `BASE_PATH=/` during build
2. Check `public_html/assets/` directory exists
3. Verify `.htaccess` MIME type definitions

### API Calls Fail

**Cause:** Backend not running (expected on Hostinger shared hosting)

**Options:**
1. Migrate to Node.js hosting (Hostinger VPS, Render, Railway, etc.)
2. Remove API-dependent features and use frontend-only
3. Use serverless functions (AWS Lambda, Netlify Functions, etc.) for specific APIs

---

## FULL-STACK DEPLOYMENT (Node.js Hosting Required)

If you upgrade to Hostinger VPS or use alternative Node.js hosting:

### Step 1: Deploy Both Frontend and Backend

```bash
# Clone repository on server
git clone https://github.com/Sharjeel-Ishaq/invisible.text.git
cd invisible.text

# Install dependencies
pnpm install

# Build everything
pnpm build
```

### Step 2: Configure Environment Variables

Create `.env` file:
```bash
# Frontend
BASE_PATH=/

# Backend
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_random_secret_here
ALLOWED_ORIGINS=yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Step 3: Start Application

```bash
# Start backend (or use PM2/systemd for production)
cd Invisible-Text-WebApp/artifacts/api-server
pnpm run start

# OR both:
pnpm dev  # from root (runs frontend on 5000, backend on 3000)
```

### Step 4: Configure Reverse Proxy (Nginx recommended)

If using Nginx on your VPS:

```nginx
upstream api_server {
  server localhost:3000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  # Redirect API to backend
  location /api {
    proxy_pass http://api_server;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # Redirect /uploads to backend
  location /uploads {
    proxy_pass http://api_server;
  }

  # Serve frontend
  location / {
    root /path/to/Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public;
    try_files $uri $uri/ /index.html;
  }
}
```

---

## VERIFICATION CHECKLIST

### Before Deployment
- [ ] `.htaccess` file is not empty
- [ ] `.htaccess` in correct location: `public_html/.htaccess`
- [ ] Frontend built successfully: `pnpm run build`
- [ ] `index.html` exists in build output
- [ ] `assets/` directory exists in build output

### After Deployment to Hostinger
- [ ] Domain loads (root path: `/`)
- [ ] SPA routing works (`/admin/login`, `/unicode-text-converter`, etc.)
- [ ] Static assets load (CSS, JS, images visible, no 404s)
- [ ] No `.htaccess` errors in console
- [ ] `robots.txt` accessible
- [ ] `sitemap.xml` accessible

### If Features Don't Work
- [ ] Identify if feature requires backend (`/api/*` calls)
- [ ] Check browser Network tab for failed requests
- [ ] Check browser Console for JavaScript errors
- [ ] Verify `.htaccess` is present and enabled

---

## FILES CHANGED FOR HOSTINGER DEPLOYMENT

1. **`public_html/.htaccess`** - Added SPA routing rules
2. **`DEPLOYMENT-AUDIT.md`** - Created architecture documentation
3. **`DEPLOY-HOSTINGER.md`** - This file

---

## DEPLOYMENT PROCESS SUMMARY

```
Code Changes → Commit & Push to GitHub
    ↓
Manual/CI Pipeline:
    ├─ Clone repo
    ├─ pnpm install
    ├─ pnpm build
    ├─ Copy dist/public → public_html/
    └─ Verify .htaccess present
    ↓
Hostinger Deployment Complete
    ├─ Frontend: ✓ Running in public_html/
    ├─ Backend: ✗ Not available (requires Node.js hosting)
    └─ SPA Routes: ✓ Working via .htaccess
```

---

## NEXT STEPS

1. **Immediate:** Upload updated `public_html/` with `.htaccess` to Hostinger
2. **Verify:** Test at your domain
3. **Monitor:** Watch for errors in Hostinger logs
4. **Plan:** Decide if you need full-stack (requires VPS/alternative hosting)

---

## SUPPORT & RESOURCES

- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Apache .htaccess:** https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html
- **Hostinger Support:** Hostinger Help Center
- **Node.js Hosting Alternatives:**
  - Railway: https://railway.app
  - Render: https://render.com
  - Fly.io: https://fly.io
  - Vercel (frontend + serverless APIs): https://vercel.com

---

**Created:** 2026-08-13  
**Project:** Invisible Text Web App  
**Repository:** https://github.com/Sharjeel-Ishaq/invisible.text.git
