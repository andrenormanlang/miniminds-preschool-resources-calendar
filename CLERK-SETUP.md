# 🔑 Clerk Publishable Key Setup Checklist

## ❌ Common Issues with Clerk on Free Deployments

### Issue: "Missing Publishable Key" Error
This happens because Clerk's publishable key is domain-specific and needs special configuration for free deployments.

## ✅ Step-by-Step Fix

### 1. Get Your Clerk Keys
1. Go to [Clerk Dashboard](https://clerk.com)
2. Select your project
3. Go to "API Keys"
4. Copy both keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Configure Domain in Clerk Dashboard

#### Option A: Use Development Keys (Simplest)
1. In Clerk Dashboard → "API Keys"
2. Use the **development keys** (pk_test_...)
3. These work on ANY domain including Render subdomains
4. Perfect for testing and demos

#### Option B: Add Your Render Domain
1. In Clerk Dashboard → "Domains"
2. Click "Add Domain"
3. Enter: `miniminds-frontend.onrender.com`
4. Clerk will provide production keys for this domain

#### Option C: Wildcard Development Domain
1. In Clerk Dashboard → "Domains"
2. Under "Development", add: `*.onrender.com`
3. This allows dev keys to work on all Render subdomains

### 3. Set Environment Variables in Render

**For Frontend Service:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=https://miniminds-backend.onrender.com
```

**For Backend Service:**
```
CLERK_SECRET_KEY=sk_test_your_secret_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Update Render Build Configuration

Make sure your `render.yaml` includes build args:
```yaml
buildCommand: docker build -t andrenormanlang/miniminds-frontend --build-arg VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY --build-arg VITE_API_URL=$VITE_API_URL .
```

### 5. Test Your Configuration

#### Local Testing:
```bash
# In frontend directory
echo "VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY"
echo "VITE_API_URL=$VITE_API_URL"
bun run dev
```

#### Production Testing:
1. Deploy to Render
2. Check the debug info in your browser console
3. The ClerkDebugInfo component will show if keys are loaded

## 🔍 Troubleshooting

### Error: "Invalid publishable key"
- **Cause:** Using production key on wrong domain
- **Fix:** Use development key or add domain to Clerk

### Error: "Missing Publishable Key"
- **Cause:** Environment variable not set or not available at build time
- **Fix:** Check Render environment variables and build command

### Error: "Clerk failed to load"
- **Cause:** CORS or network issues
- **Fix:** Check browser network tab and backend CORS settings

### Error: "User not found in backend"
- **Cause:** Webhook not configured or user not synced
- **Fix:** Set up Clerk webhook or manual user sync

## 📋 Quick Verification Checklist

- [ ] ✅ Clerk publishable key copied from dashboard
- [ ] ✅ Domain added to Clerk (or using dev keys)
- [ ] ✅ Environment variables set in Render
- [ ] ✅ Build command includes build args
- [ ] ✅ CORS configured for your domain
- [ ] ✅ Debug component shows "Key: ✅ Set"
- [ ] ✅ Sign up/sign in works in browser

## 🎯 Recommended Approach for Free Deployment

**Use Development Keys** - They're the most reliable for free deployments:

1. Copy `pk_test_...` and `sk_test_...` from Clerk dashboard
2. Set them in Render environment variables
3. Add `*.onrender.com` to Clerk development domains (optional)
4. Deploy and test

This approach works immediately and doesn't require domain verification!
