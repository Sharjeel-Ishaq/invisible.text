# Invisible Text App - Deployment Audit & Hostinger 403 Diagnosis

## AUDIT RESULTS

### 1. PROJECT ARCHITECTURE

**Type:** Monorepo (pnpm workspaces) with 2 integrated applications:
- **Frontend:** React 19 + Vite SPA (Invisible Text Web App)
- **Backend:** Express.js REST API (API Server)

**Structure:**
```
Invisible-Text-WebApp/
├── artifacts/
│   ├── api-server/          ← Express.js backend
│   ├── invisible-webapp/     ← React Vite frontend
│   └── mockup-sandbox/
├── lib/
├── scripts/
├── package.json
└── pnpm-workspace.yaml
```

### 2. FRONTEND ANALYSIS

**Framework:** React 19 with Vite 7.3.2
**Router:** Wouter (lightweight client-side SPA router)
**Build System:** Vite

**Package Location:**
- Source: `Invisible-Text-WebApp/artifacts/invisible-webapp/src/`
- Output: `Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public/`

**Vite Configuration:**
- **Base Path:** Configurable via `BASE_PATH` env var (defaults to `/`)
- **Out Directory:** `dist/public/`
- **Type:** Single-page application (SPA)
- **Build Command:** `vite build --config vite.config.ts`

**Routes (all client-side):**
```
/
/about
/blogs
/blogs/:slug
/admin/login
/admin/dashboard
/free-fire-text
/reverse-text
/mirror-text-generator
/unicode-text-converter
/text-spacer
/contact
/privacy-policy
/terms-and-conditions
/disclaimer
```

**API Integration:**
- Frontend makes fetch requests to `/api/*` endpoints
- Backend must serve API on same domain
- Credentials included in requests: `credentials: "include"`
- CORS configured in Express backend

### 3. BACKEND ANALYSIS

**Framework:** Express.js (Node.js)
**Build System:** esbuild
**Entry Point:** `artifacts/api-server/src/index.ts`
**Port:** Configurable via `PORT` env var (default: 3000)

**Build Process:**
1. TypeScript compiled to ESM via esbuild
2. Output: `artifacts/api-server/dist/index.mjs`
3. Run command: `node --enable-source-maps ./dist/index.mjs`

**Express Configuration:**
```javascript
- CORS enabled (production: restricted to ALLOWED_ORIGINS)
- Session management (PostgreSQL store)
- Static file serving from `/public` and `/uploads`
- API routes: `/api/*`
- SPA fallback: Non-API routes return index.html for client-side routing
```

**API Routes Served:**
- `/api/*` - Application API endpoints
- `/uploads/*` - User-uploaded files
- `/public/*` - Static assets

**Production Requirements:**
- Node.js runtime required
- PostgreSQL database connection
- Environment variables: `PORT`, `SESSION_SECRET`, `ALLOWED_ORIGINS`, database credentials
- Cannot run on standard shared PHP hosting

### 4. BUILD PROCESS

**Root Build Script:** `pnpm run build`
→ Executes: `node ./Invisible-Text-WebApp/scripts/build.js`

**Build Script Steps:**
1. Runs `pnpm run typecheck` (global workspace)
2. Runs `pnpm -r --if-present run build` (all packages)
3. Consolidates into root `dist/` folder:
   - Frontend: `artifacts/invisible-webapp/dist/public/` → `dist/webapp/`
   - Backend: `artifacts/api-server/dist/` → `dist/api-server/`

**Individual Package Build:**
- **Frontend:** `cd Invisible-Text-WebApp/artifacts/invisible-webapp && pnpm run build`
  - Output: `dist/public/` containing `index.html`, `assets/`, etc.
  
- **Backend:** `cd Invisible-Text-WebApp/artifacts/api-server && pnpm run build`
  - Output: `dist/index.mjs` (and dependencies)

### 5. CURRENT DEPLOYMENT SETUP

**Hostinger Deploy Script:** `scripts/deploy-hostinger.js`
```javascript
1. Clean old builds: node ./Invisible-Text-WebApp/scripts/clean.js
2. Build all: node ./Invisible-Text-WebApp/scripts/build.js
3. Remove public_html/
4. Copy webDist = "Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public"
5. To target = "public_html/"
```

**Current public_html/ Contents:**
```
public_html/
├── .htaccess        ← EMPTY (this is a problem!)
├── index.html
├── assets/
├── ads.txt
├── robots.txt
├── sitemap.xml
├── favicon.png
├── images/
└── ...
```

### 6. ROOT CAUSE OF 403 FORBIDDEN

**Primary Issue: Empty `.htaccess` file**

The `.htaccess` in `public_html/` is empty. For a Vite SPA on Apache-based hosting (Hostinger), you need routing rules to:

1. **Serve static files normally** when they exist
2. **Fallback to index.html** for all other requests (SPA routing)
3. **Prevent directory listing** when no index.html is present

Without `.htaccess`, Apache may be returning 403 when:
- Trying to access directories without `index.html`
- Some configurations deny directory access by default

**Secondary Issues:**

1. **No SPA fallback routing** - Frontend routes like `/admin/login`, `/unicode-text-converter` will fail with 404 if `.htaccess` is missing
2. **Backend is optional on Hostinger** - The backend API server cannot run on standard shared hosting. Frontend-only deployment is expected for Hostinger
3. **API dependency** - Frontend calls `/api/*` endpoints that won't work on Hostinger without backend

### 7. REPLIT vs HOSTINGER DIFFERENCE

**Replit (Works):**
- Node.js runtime available
- Both frontend and backend can run
- Proxy handles `/` → frontend and `/api` → backend
- Environment: `REPL_ID` detected

**Hostinger (403 Error):**
- Static/PHP hosting only (typically)
- No Node.js runtime for backend
- Apache server with `.htaccess` support
- Frontend must be deployed as static files
- Backend APIs won't work unless Hostinger has Node.js hosting

---

## DIAGNOSIS SUMMARY

### Root Cause
**Empty `.htaccess` file** causing Apache to reject requests to SPA routes.

### Secondary Issue  
**Backend cannot run on standard Hostinger hosting.** The frontend is a React SPA that calls `/api/*` endpoints, but Express backend requires Node.js hosting (not available on shared hosting).

### Files Affected
- `public_html/.htaccess` - Empty, needs SPA routing rules
- `Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public/index.html` - Correct content, needs `.htaccess` to work
- Backend (`api-server/`) - Cannot run on Hostinger without dedicated Node.js hosting

---

## VERIFICATION COMMANDS

```bash
# Check current public_html structure
ls -la public_html/

# Check .htaccess content
cat public_html/.htaccess

# Check if index.html exists
test -f public_html/index.html && echo "index.html exists" || echo "index.html MISSING"

# Check vite dist
ls -la Invisible-Text-WebApp/artifacts/invisible-webapp/dist/public/
```
