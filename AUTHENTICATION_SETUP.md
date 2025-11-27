# Authentication Setup for Production

## Firebase Console Configuration

### 1. Authorized Domains
Add your production domain to Firebase authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click "Add domain" and add:
   - `yourdomain.com`
   - `www.yourdomain.com`
   - Your Vercel domain (e.g., `yourapp.vercel.app`)

### 2. Google Sign-In Provider
Ensure Google Sign-In is enabled:

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add **Project support email**

---

## Google Cloud Console Configuration

### OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure your app information:
   - App name: TRACKER KE
   - User support email
   - Developer contact email

### OAuth 2.0 Client IDs
1. Go to **APIs & Services** → **Credentials**
2. Click on your **Web client** (auto-created by Firebase)
3. Add authorized redirect URIs:
   ```
   https://yourdomain.com/__/auth/handler
   https://www.yourdomain.com/__/auth/handler  
   https://yourapp.vercel.app/__/auth/handler
   ```

---

## Environment Variables (Vercel)

Add these to your Vercel project environment variables:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Note**: These values are already in your local `.env` file. Copy them to Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable
3. Select all environments (Production, Preview, Development)

---

## Testing Authentication Locally

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test Google Login**:
   - Navigate to `/profile`
   - Click "Continue with Google"
   - Complete OAuth flow
   - Verify user is created in Firestore (`users` collection)

3. **Test Terms & Conditions**:
   - New users should see Terms modal
   - Accept terms to proceed
   - Check that `termsAccepted: true` is saved in user document

4. **Test Protected Routes**:
   - Try accessing `/add-price` without login
   - Should see "Login Required" prompt
   - After login, should access submission flow

---

## Admin Access Setup

To make yourself an admin:

1. **Login once** as a regular user
2. **Manually update Firestore**:
   - Go to Firebase Console → Firestore Database
   - Find your user document in `users` collection
   - Add field: `role` = `admin`
3. **Logout and login again**
4. Navigate to `/admin` to access admin panel

---

## Production Checklist

- [ ] Added production domain to Firebase authorized domains
- [ ] Configured OAuth redirect URIs in Google Cloud Console
- [ ] Set all environment variables in Vercel
- [ ] Tested Google login flow
- [ ] Created at least one admin user
- [ ] Verified Firestore security rules are in place
