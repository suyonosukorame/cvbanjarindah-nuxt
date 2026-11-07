# ☁️ Cloudflare Pages Deployment Guide

**Project:** CV Banjar Indah - Nuxt 3 Website
**Platform:** Cloudflare Pages
**Last Updated:** November 7, 2026

---

## ✅ Fix Applied

**Issue:** Build failed with error:
```
ERROR packages field missing or empty
For help, run: pnpm help install
```

**Root Cause:** Invalid `pnpm-workspace.yaml` file caused pnpm to treat project as monorepo.

**Solution:** Removed `pnpm-workspace.yaml` (commit: `045eed8`)

---

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)

**Via Cloudflare Dashboard:**

1. **Login to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Navigate to: **Workers & Pages** → **Create Application** → **Pages**

2. **Connect GitHub Repository**
   - Click **Connect to Git**
   - Select repository: `suyonosukorame/cvbanjarindah-nuxt`
   - Authorize Cloudflare access

3. **Build Configuration**
   ```
   Framework preset: Nuxt.js
   Build command: pnpm run build
   Build output directory: dist
   Root directory: (leave blank)
   Environment variables: (add if needed)
   ```

4. **Environment Variables (if needed)**
   ```
   NUXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NUXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
   NUXT_PUBLIC_APP_NAME=CV Banjar Indah
   ```

5. **Deploy**
   - Click **Save and Deploy**
   - Wait for build to complete (2-5 minutes)
   - Site will be live at: `https://cvbanjarindah.pages.dev`

---

### Option 2: Manual Deployment (CLI)

**Prerequisites:**
```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

**Deploy Commands:**
```bash
# Build project
pnpm run build

# Deploy to Cloudflare Pages
pnpm run deploy

# Or manually:
wrangler pages deploy dist --project-name=cvbanjarindah
```

---

## 📋 Build Settings Summary

**Framework:** Nuxt 3 (SSR disabled)
**Node Version:** v20.x or v18.x
**Package Manager:** pnpm v9.x
**Build Command:** `pnpm run build`
**Output Directory:** `dist/`
**Deployment Target:** Cloudflare Pages

---

## 🔧 Configuration Files

### `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  ssr: false, // Static generation
  compatibilityDate: '2024-11-06',
  
  nitro: {
    preset: 'cloudflare-pages', // Cloudflare deployment
  },
  
  // ... other configs
});
```

### `wrangler.toml`
```toml
name = "cvbanjarindah"
compatibility_date = "2024-11-06"
pages_build_output_dir = "dist"
```

### `package.json` scripts
```json
{
  "scripts": {
    "build": "nuxi build",
    "deploy": "nuxi build && wrangler pages deploy dist"
  }
}
```

---

## ⚠️ Common Issues & Solutions

### 1. ❌ Error: `packages field missing or empty`

**Cause:** Invalid `pnpm-workspace.yaml` file

**Solution:** Remove the file (already fixed)
```bash
git rm pnpm-workspace.yaml
git commit -m "fix: remove invalid pnpm-workspace.yaml"
git push origin main
```

---

### 2. ❌ Error: `Module not found: @supabase/supabase-js`

**Cause:** Missing dependencies in `package.json`

**Solution:** Install required packages
```bash
pnpm add @supabase/supabase-js @google/genai h3
pnpm install --frozen-lockfile
```

---

### 3. ❌ Error: `Build failed with exit code 1`

**Cause:** TypeScript or build errors

**Solution:** Check build locally first
```bash
pnpm run build

# Fix any TypeScript errors
# Then commit and push
```

---

### 4. ❌ Error: `ENOENT: no such file or directory`

**Cause:** Missing files or incorrect paths

**Solution:** Check `srcDir` in `nuxt.config.ts`
```typescript
srcDir: 'app/', // Make sure this matches your structure
```

---

### 5. ❌ Error: `Environment variables not found`

**Cause:** Missing environment variables

**Solution:** Add in Cloudflare Dashboard
- Go to: **Settings** → **Environment variables**
- Add all variables from `.env.example`

---

### 6. ❌ Error: `Functions are not supported`

**Cause:** Trying to use Nuxt server routes with SSR=false

**Solution:** This project uses SSR=false (static), so no server routes.
If you need API routes, consider:
- Cloudflare Workers (separate)
- Supabase Edge Functions
- Third-party API services

---

### 7. ⚠️ Warning: `The darkMode option...`

**Cause:** Deprecated TailwindCSS config

**Solution:** Update `tailwind.config.ts`
```typescript
export default {
  darkMode: 'media', // Change from 'false'
  // ... other configs
}
```

---

## 🔍 Verify Deployment

**After deployment, check:**

1. **Homepage loads:** https://your-site.pages.dev/
2. **Navigation works:** /produk, /area, /tentang, /kontak
3. **AI Assistant opens:** Click chat button
4. **Images load:** Check if all images display
5. **Responsive:** Test on mobile, tablet, desktop
6. **Console:** No errors in browser console (F12)

---

## 🌐 Custom Domain Setup

**Add custom domain:**

1. Go to: **Custom domains** → **Add a custom domain**
2. Enter domain: `cvbanjarindah.com` (example)
3. Add DNS records (automatic or manual):
   ```
   CNAME: www → cvbanjarindah.pages.dev
   CNAME: @ → cvbanjarindah.pages.dev
   ```
4. Wait for SSL certificate (5-15 minutes)
5. Access site at: `https://cvbanjarindah.com`

---

## 📊 Build Performance

**Expected build times:**
- **First build:** 2-5 minutes
- **Subsequent builds:** 1-3 minutes (cached)

**Build output size:**
- **Total:** ~500KB - 2MB (gzipped)
- **JavaScript:** ~300KB
- **CSS:** ~50KB
- **Assets:** ~200KB

---

## 🔄 Auto-Deploy from GitHub

**Setup automatic deployment:**

1. **Branch Settings** (in Cloudflare)
   - Production branch: `main`
   - Preview branches: All branches

2. **Build Triggers**
   - ✅ Auto-deploy on push to `main`
   - ✅ Preview deploy on pull requests
   - ✅ Deploy on tag creation

3. **Notifications** (optional)
   - Email on deployment success/failure
   - Webhook to Slack/Discord

---

## 🛠️ Troubleshooting Commands

**Local debugging:**
```bash
# Clean build
rm -rf .nuxt dist node_modules
pnpm install
pnpm run build

# Test build locally
pnpm run preview

# Check for errors
pnpm run build 2>&1 | tee build.log
```

**Check dependencies:**
```bash
# Verify all packages installed
pnpm list

# Update dependencies
pnpm update

# Fix lock file
rm pnpm-lock.yaml
pnpm install
```

**Cloudflare CLI debugging:**
```bash
# Check Wrangler version
wrangler --version

# List deployments
wrangler pages deployments list --project-name=cvbanjarindah

# View deployment logs
wrangler pages deployment tail
```

---

## 📱 Performance Optimization

**Tips for faster deployment:**

1. **Enable build cache** (Cloudflare auto-enables this)
2. **Optimize images:** Use WebP format
3. **Lazy load components:** Use `defineAsyncComponent()`
4. **Code splitting:** Nuxt auto-splits by route
5. **CDN:** Cloudflare serves from edge locations

**Expected performance:**
- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3.5s
- **Lighthouse Score:** > 90
- **PageSpeed Insights:** Green scores

---

## 🔐 Security Best Practices

**Environment variables:**
- ✅ Never commit `.env` to Git (already in `.gitignore`)
- ✅ Use Cloudflare environment variables UI
- ✅ Rotate API keys regularly

**API Keys:**
- ✅ Use `NUXT_PUBLIC_*` for public keys only
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- ✅ Never expose in client-side code

**Headers:**
- ✅ CSP (Content Security Policy) - auto by Cloudflare
- ✅ HTTPS only - enforced by Cloudflare
- ✅ CORS - configure in Supabase if needed

---

## 📞 Support & Resources

**Cloudflare Docs:**
- [Pages Documentation](https://developers.cloudflare.com/pages/)
- [Nuxt on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/)
- [Build Configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)

**Nuxt Docs:**
- [Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Cloudflare Preset](https://nitro.unjs.io/deploy/providers/cloudflare)

**GitHub:**
- Repository: https://github.com/suyonosukorame/cvbanjarindah-nuxt
- Issues: Report bugs or request features

---

## ✅ Deployment Checklist

Before deployment:
- [ ] All environment variables set in Cloudflare
- [ ] Build runs successfully locally (`pnpm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Images optimized (< 500KB each)
- [ ] Mobile responsive tested
- [ ] SEO meta tags added
- [ ] Analytics configured (optional)

After deployment:
- [ ] Homepage loads correctly
- [ ] All routes work (/produk, /area, etc.)
- [ ] AI Assistant functional
- [ ] Images display properly
- [ ] Forms submit correctly (contact form)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance tested (Lighthouse)

---

## 🎯 Next Steps

1. **Monitor Deployment**
   - Check Cloudflare dashboard for build status
   - Watch for any errors in logs

2. **Test Live Site**
   - Click through all pages
   - Test on mobile devices
   - Verify AI Assistant works

3. **Configure Analytics** (optional)
   - Cloudflare Web Analytics
   - Google Analytics
   - Plausible Analytics

4. **Setup Monitoring** (optional)
   - Uptime monitoring (UptimeRobot)
   - Error tracking (Sentry)
   - Performance monitoring (Cloudflare Analytics)

---

**Deployment Fixed! ✅**

File `pnpm-workspace.yaml` sudah dihapus. 
Push sudah dilakukan ke: https://github.com/suyonosukorame/cvbanjarindah-nuxt

**Cloudflare akan auto-deploy pada push selanjutnya!**

---

**Last Updated:** November 7, 2026
**Status:** Ready for Production Deployment
