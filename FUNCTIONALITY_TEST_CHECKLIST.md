# ✅ Functionality Test Checklist

**Time Required:** 5-10 minutes  
**Status:** Ready to test

---

## 🎯 10-Point Functionality Test

Test each item below. Check off as you complete:

### 1. Signup & Email Verification
- [ ] Go to `/register` page
- [ ] Create a new account with test email
- [ ] Check email inbox for verification email
- [ ] Click verification link in email
- [ ] Account should be verified

**Expected:** Account created, email received, verification works

---

### 2. Login
- [ ] Go to `/login` page
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] Should redirect to home page (`/`)

**Expected:** Login successful, redirects to home

---

### 3. Create Journal Entry
- [ ] Click "New Journal" or go to `/journal`
- [ ] Fill in:
  - Date (should default to today)
  - Rating (1-10)
  - What went well
  - What could be better
  - Gratitude
- [ ] Click "Save & Finish"
- [ ] Should show "Saving..." then redirect to home

**Expected:** Journal saves successfully, redirects to home

---

### 4. View Past Journals
- [ ] Go to home page
- [ ] Click "History" button (or go to `/history`)
- [ ] Should see the journal you just created
- [ ] Journal should show correct date, rating, and text

**Expected:** Past journals page shows your journal entry

---

### 5. Streak Display
- [ ] On home page, check streak card
- [ ] Should show "1 day streak 🔥" (or current streak)
- [ ] Should show "Longest: X days" below

**Expected:** Streak displays correctly on home page

---

### 6. Edit Journal Entry
- [ ] Go to `/history` page
- [ ] Click on a journal entry to edit
- [ ] Change some text (e.g., update "What went well")
- [ ] Click "Save & Finish"
- [ ] Go back to history
- [ ] Verify changes were saved

**Expected:** Changes save correctly, visible in history

---

### 7. Delete Journal Entry
- [ ] Go to `/history` page
- [ ] Find a journal entry
- [ ] Click delete button (trash icon)
- [ ] Confirm deletion
- [ ] Journal should disappear from list

**Expected:** Journal deleted, no longer in history

---

### 8. Export Data
- [ ] Go to `/settings` page
- [ ] Scroll to "Download My Data" section
- [ ] Click "Download My Data" button
- [ ] Should show "Preparing download..."
- [ ] File should download automatically
- [ ] Open downloaded JSON file
- [ ] Verify it contains your journal entries

**Expected:** JSON file downloads with all your data

---

### 9. Delete Account
- [ ] Go to `/settings` page
- [ ] Scroll to "Delete My Account" section
- [ ] Click "Delete My Account"
- [ ] Enter your password
- [ ] Click "Confirm Delete"
- [ ] Should show "Deleting account..."
- [ ] Should log you out
- [ ] Try to log back in with same credentials
- [ ] Should fail (account deleted)

**Expected:** Account deleted, can't log back in

**⚠️ WARNING:** This will delete your account! Only do this if you're okay with losing test data.

---

### 10. Logout & Protected Pages
- [ ] While logged in, go to `/settings`
- [ ] Click "Sign Out" button
- [ ] Should redirect to `/login`
- [ ] Try to access `/` (home page) directly
- [ ] Should redirect to `/login` (protected)
- [ ] Try to access `/journal` directly
- [ ] Should redirect to `/login` (protected)

**Expected:** Logout works, protected pages require login

---

## 📊 Test Results

**After completing all tests, fill this out:**

- [ ] All 10 tests passed ✅
- [ ] Some tests failed (list which ones):
  - Test #___: _______________
  - Test #___: _______________

---

## 🎯 What to Report

**After testing, tell me:**

- ✅ **"All 10 tests passed!"** → Ready to deploy!
- 🟡 **"Test #X failed"** → I'll help fix it
- 🔴 **"Multiple tests failed"** → List them and I'll help

---

## ⚠️ Important Notes

1. **For Test #9 (Delete Account):**
   - This will permanently delete your account
   - Only do this if you're okay with losing test data
   - You can skip this if you've already tested it before

2. **If you find bugs:**
   - Note which test failed
   - Note what happened vs. what should happen
   - I'll help fix them before deployment

3. **Take your time:**
   - Don't rush through tests
   - Make sure each feature actually works
   - Better to find issues now than after deployment!

---

**Ready? Start with Test #1 and work through them one by one!** 🚀


