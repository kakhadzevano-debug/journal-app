# Production Deployment Guide

## Pre-Deployment Checklist

### ✅ 1. Test Everything Locally

Before deploying, make sure everything works:

- [ ] User registration and login
- [ ] Creating journal entries
- [ ] Editing journal entries
- [ ] Deleting journal entries
- [ ] Viewing history
- [ ] Streak tracking updates correctly
- [ ] Toast notifications work
- [ ] Confetti animations work
- [ ] Voice recording works
- [ ] AI text cleanup works (if enabled)
- [ ] Mobile responsiveness

### ✅ 2. Environment Variables Setup

You'll need these environment variables in production:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `GEMINI_API_KEY` - Your Google Gemini API key (for AI cleanup)

**How to get Supabase keys:**
1. Go to your Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**How to get Gemini API key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create or copy your API key
3. This goes in `GEMINI_API_KEY`

### ✅ 3. Database Setup

Make sure your production database is ready:

- [ ] Run `supabase_streak_setup.sql` in your Supabase SQL Editor
- [ ] Verify `streaks` table exists
- [ ] Verify `journal_entries` table has `created_at` column
- [ ] Test RLS (Row Level Security) policies work

### ✅ 4. Build Test

Test the production build locally:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` and test everything works.

**Fix any build errors before deploying!**

### ✅ 5. Security Checklist

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] `.env.local` is in `.gitignore` (should already be)
- [ ] No sensitive data in code
- [ ] Supabase RLS policies are enabled
- [ ] Authentication is working correctly

### ✅ 6. Performance Optimization

- [ ] Images optimized (if you add any)
- [ ] Code is minified (Next.js does this automatically)
- [ ] Unused dependencies removed
- [ ] Check bundle size: `npm run build` shows sizes

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Why Vercel:**
- Made by the Next.js team
- Zero-config deployment
- Automatic HTTPS
- Free tier available
- Easy environment variable setup
- Automatic deployments from Git

**Steps:**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY`
   - Click "Deploy"

3. **Your app will be live at:** `https://your-app-name.vercel.app`

**Vercel automatically:**
- Builds your app
- Sets up HTTPS
- Provides a custom domain option
- Handles deployments on every git push

### Option 2: Netlify

Similar to Vercel:

1. Push to GitHub
2. Go to https://netlify.com
3. Import from GitHub
4. Add environment variables
5. Deploy

### Option 3: Self-Hosted (VPS/Server)

If you want to host it yourself:

1. **Get a VPS** (DigitalOcean, AWS, etc.)
2. **Install Node.js and npm**
3. **Clone your repo**
4. **Set environment variables**
5. **Build and run:**
   ```bash
   npm run build
   npm start
   ```
6. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "journal" -- start
   pm2 save
   pm2 startup
   ```

---

## Post-Deployment Steps

### 1. Test Production Build

- [ ] Visit your live URL
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

### 2. Set Up Custom Domain (Optional)

**Vercel:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

**Netlify:**
- Go to Site Settings → Domain Management
- Add custom domain
- Follow DNS setup instructions

### 3. Set Up Analytics (Optional)

Consider adding:
- Google Analytics
- Vercel Analytics (if using Vercel)
- User feedback tools

### 4. Set Up Monitoring

- Error tracking (Sentry, LogRocket)
- Uptime monitoring
- Performance monitoring

### 5. Backup Strategy

- **Database:** Supabase has automatic backups (check your plan)
- **Code:** GitHub is your backup
- **Environment variables:** Keep a secure backup

---

## Environment Variables Reference

### Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### Production (Vercel/Netlify)
Add the same variables in your hosting platform's dashboard.

**Important:** 
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for public keys)
- `GEMINI_API_KEY` is server-side only (secure)

---

## Common Issues & Solutions

### Build Fails
- Check for TypeScript errors: `npm run build`
- Check console for errors
- Verify all environment variables are set

### API Errors in Production
- Check environment variables are set correctly
- Verify Supabase URL and keys are correct
- Check CORS settings in Supabase

### Database Connection Issues
- Verify Supabase project is active
- Check RLS policies allow access
- Verify user authentication is working

### Mobile Issues
- Test on actual devices, not just browser dev tools
- Check viewport meta tag (Next.js includes this)
- Test touch interactions

---

## Cost Estimates

### Free Tier Options:

**Vercel:**
- Free tier: 100GB bandwidth/month
- Perfect for personal projects

**Supabase:**
- Free tier: 500MB database, 2GB bandwidth
- Upgrade if you get many users

**Google Gemini API:**
- Pay-as-you-go
- Very cheap (~$0.0001 per journal entry)

**Total for small app:** ~$0-5/month

---

## Next Steps After Deployment

1. **Share your app** with friends/family for testing
2. **Gather feedback** and iterate
3. **Monitor usage** and errors
4. **Add features** based on feedback
5. **Scale** as needed

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] Database setup complete
- [ ] Build test passed locally
- [ ] Deployed to hosting platform
- [ ] Environment variables added in hosting dashboard
- [ ] Production site tested
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)

---

## Need Help?

If you run into issues:
1. Check the build logs in your hosting platform
2. Check browser console for errors
3. Verify all environment variables are set
4. Test locally with `npm run build && npm start`

Good luck with your deployment! 🚀


