# 🚀 STEP 1.3: Deploy with Vercel CLI

**Goal:** Deploy your app directly from your computer (no Git needed!)

**Time:** 10-15 minutes

---

## 🎯 What We're Doing

Instead of using Git, we'll deploy directly from your computer using Vercel's command-line tool. This is actually easier!

---

## 📝 Step-by-Step Instructions

### Step 1: Install Vercel CLI

**In your terminal (where you ran `npm run build`), run:**

```bash
npm install -g vercel
```

**Wait for it to finish** (might take 1-2 minutes)

---

### Step 2: Login to Vercel

**Run this command:**

```bash
vercel login
```

**What will happen:**
1. It will open your web browser
2. You'll see a Vercel login page
3. Click "Authorize" or "Continue"
4. It will say "Success! You are now logged in"
5. Go back to your terminal

---

### Step 3: Deploy Your Project

**Make sure you're in your project folder:**
```bash
cd C:\Users\happy\OneDrive\Desktop\Journal
```

**Then run:**
```bash
vercel
```

**What will happen:**
1. It will ask: "Set up and deploy?" → Type **Y** and press Enter
2. It will ask: "Which scope?" → Press Enter (use default)
3. It will ask: "Link to existing project?" → Type **N** and press Enter
4. It will ask: "What's your project's name?" → Press Enter (use default: "journal")
5. It will ask: "In which directory is your code located?" → Press Enter (use default: "./")
6. It will start deploying...

**Wait for it to finish** (2-3 minutes)

---

### Step 4: Add Environment Variables

**After deployment, we need to add your environment variables.**

**Run this command for each variable:**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```
- When asked "What's the value?", paste your Supabase URL from `.env.local`
- When asked "Which Environments?", type **a** (for all: Production, Preview, Development)
- Press Enter

**Repeat for each variable:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
```

---

### Step 5: Redeploy with Environment Variables

**After adding all variables, redeploy:**

```bash
vercel --prod
```

**This will deploy to production with your environment variables.**

---

## ✅ Success!

After `vercel --prod` finishes, you'll see:
- A URL like: `https://your-app.vercel.app`
- Your app is now live! 🎉

---

## 🎯 Let's Start!

I'll help you run each command step by step. Ready to start?


