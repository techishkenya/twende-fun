# Deploying Twende.fun to Vercel

## Quick Deploy (Recommended - 5 minutes)

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Build the project** (optional - Vercel can do this):
```bash
npm run build
```

3. **Deploy**:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **twende-fun** (or your preferred name)
- Directory? **./  ** (current directory)
- Override settings? **N**

4. **Production deployment**:
```bash
vercel --prod
```

Your app will be live at: `https://twende-fun.vercel.app` (or custom domain)

---

### Option 2: Deploy via Vercel Dashboard (Easiest)

1. **Push code to GitHub** (if not already):
```bash
git init
git add .
git commit -m "Initial commit - Twende.fun PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/twende-fun.git
git push -u origin main
```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your `twende-fun` repository

3. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: **./  **
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**: Click "Deploy"

Your app will be live in ~2 minutes!

---

## Alternative: Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build**:
```bash
npm run build
```

3. **Deploy**:
```bash
netlify deploy
```

4. **Production**:
```bash
netlify deploy --prod
```

---

## Environment Variables (For Future Firebase Integration)

When you're ready to add real Firebase:

### Vercel:
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... etc
```

Or add via dashboard: Project Settings → Environment Variables

### Netlify:
Site Settings → Environment Variables → Add Variable

---

## Custom Domain

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

---

## PWA Considerations

The app is already configured as a PWA with:
- Service worker (via VitePWA plugin)
- Manifest file
- Offline support
- Install prompt

Users can "Add to Home Screen" on mobile devices!

---

## Post-Deployment Checklist

- [ ] Test on mobile device
- [ ] Verify PWA install works
- [ ] Test all routes
- [ ] Check responsive design
- [ ] Share link with beta testers
- [ ] Monitor Vercel/Netlify analytics

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

## Current App Status

✅ **Ready for deployment with:**
- 230+ FMCG products
- 4 supermarkets with real branch data
- Price comparison functionality
- Search with trending items
- Supermarket trending pages
- Profile system
- Gamification (leaderboard, points)
- PWA capabilities
- Mock authentication (works without Firebase)

🔄 **Future enhancements:**
- Real Firebase integration
- OCR for receipt scanning
- Real-time price updates
- User contributions
- Push notifications
