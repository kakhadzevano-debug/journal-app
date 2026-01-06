# 🚀 PRE-LAUNCH CHECKLIST

**Project:** Voice Journal App  
**Date:** _______________  
**Tester:** _______________  
**Estimated Time:** 4-6 hours

---

## 📋 TESTING OVERVIEW

This checklist covers **every feature, page, scenario, and edge case** in the application. Use it systematically to ensure everything works before launch.

**How to use:**
- ✅ Check off each item as you complete it
- ⚠️ Note any issues in the "Notes" column
- 🔴 Mark critical issues that block launch
- 🟡 Mark minor issues that can be fixed post-launch

---

## 🔐 SECTION 1: AUTHENTICATION & SECURITY

### 1.1 User Registration & Email Verification
- [ ] **Create new account**
  - [ ] Enter valid email and password (8+ chars)
  - [ ] Click "Sign up" button
  - [ ] Verify "Creating account..." loading state appears
  - [ ] Verify email verification message appears
  - [ ] Check email inbox for verification link
  - [ ] Click verification link in email
  - [ ] Verify account is activated
  - [ ] Verify redirect to home page after verification

- [ ] **Registration validation**
  - [ ] Try password < 8 characters → Error shows
  - [ ] Try invalid email format → Error shows
  - [ ] Try matching passwords → Error shows
  - [ ] Try existing email → Error shows
  - [ ] All error messages are user-friendly

- [ ] **Logged-in user on register page**
  - [ ] Log in, then navigate to `/register`
  - [ ] Verify redirect to home page automatically

### 1.2 User Login
- [ ] **Successful login**
  - [ ] Enter correct email and password
  - [ ] Click "Sign In" button
  - [ ] Verify "Logging in..." loading state appears
  - [ ] Verify redirect to home page
  - [ ] Verify user is logged in (streak shows)

- [ ] **Login validation**
  - [ ] Try wrong password → Error shows
  - [ ] Try non-existent email → Error shows
  - [ ] Try empty fields → Validation error
  - [ ] All error messages are clear

- [ ] **Logged-in user on login page**
  - [ ] Log in, then navigate to `/login`
  - [ ] Verify redirect to home page automatically

- [ ] **Session expiration handling**
  - [ ] Log in successfully
  - [ ] Wait or manually expire session (dev tools)
  - [ ] Try to navigate to protected page
  - [ ] Verify redirect to login with "session expired" message
  - [ ] Log in again
  - [ ] Verify redirect back to original page

### 1.3 Password Reset Flow
- [ ] **Request password reset**
  - [ ] Go to `/login` page
  - [ ] Click "Forgot password?" link
  - [ ] Verify redirect to `/forgot-password`
  - [ ] Enter email address
  - [ ] Click "Send reset link" button
  - [ ] Verify "Sending..." loading state appears
  - [ ] Verify success message appears
  - [ ] Check email inbox for reset link
  - [ ] Verify cooldown timer starts (1 hour)

- [ ] **Rate limiting (cooldown)**
  - [ ] Request password reset
  - [ ] Immediately try to request again
  - [ ] Verify button is disabled during cooldown
  - [ ] Verify cooldown message appears
  - [ ] Verify countdown timer shows remaining time
  - [ ] Verify button re-enables after cooldown expires

- [ ] **Reset password**
  - [ ] Click reset link in email
  - [ ] Verify redirect to `/reset-password` page
  - [ ] Enter new password (meets requirements)
  - [ ] Enter matching confirm password
  - [ ] Verify password requirements checklist works
  - [ ] Verify "Passwords match" indicator appears
  - [ ] Click "Reset password" button
  - [ ] Verify "Resetting..." loading state appears
  - [ ] Verify success message appears
  - [ ] Verify redirect to `/login` page
  - [ ] Log in with new password → Success

- [ ] **Reset password validation**
  - [ ] Try password < 8 chars → Error shows
  - [ ] Try password without uppercase → Requirement unchecked
  - [ ] Try password without lowercase → Requirement unchecked
  - [ ] Try password without number → Requirement unchecked
  - [ ] Try mismatched passwords → Error shows
  - [ ] Verify "Reset password" button disabled until all requirements met

- [ ] **Expired reset link**
  - [ ] Request password reset
  - [ ] Wait 1+ hour (or manually expire link)
  - [ ] Click expired link
  - [ ] Verify error message appears
  - [ ] Verify "Request new reset link" option available

### 1.4 Logout
- [ ] **Sign out**
  - [ ] Log in successfully
  - [ ] Go to Settings page
  - [ ] Click "Sign Out" button
  - [ ] Verify redirect to `/login` page
  - [ ] Verify user is logged out
  - [ ] Try to access protected page → Redirects to login

### 1.5 Security Checks
- [ ] **Row-Level Security (RLS)**
  - [ ] Create two test accounts (User A and User B)
  - [ ] Log in as User A
  - [ ] Create journal entries
  - [ ] Log out, log in as User B
  - [ ] Verify User B cannot see User A's journals
  - [ ] Verify User B cannot edit User A's journals
  - [ ] Verify User B cannot delete User A's journals

- [ ] **Data isolation**
  - [ ] Verify each user only sees their own data
  - [ ] Verify streak data is user-specific
  - [ ] Verify notification preferences are user-specific

- [ ] **API authentication**
  - [ ] Try accessing `/api/cleanup-text` without login → 401 error
  - [ ] Try accessing `/api/delete-account` without login → 401 error
  - [ ] Verify all API routes require authentication

- [ ] **Session management**
  - [ ] Verify sessions persist across page refreshes
  - [ ] Verify logout clears session completely
  - [ ] Verify multiple devices can be logged in simultaneously

---

## 📝 SECTION 2: JOURNAL ENTRY FEATURES

### 2.1 Create New Journal Entry
- [ ] **Basic entry creation**
  - [ ] Click "Start Journaling" or "Create Entry" button
  - [ ] Verify redirect to `/journal` page
  - [ ] Verify date defaults to today
  - [ ] Verify rating defaults to 5.0
  - [ ] Fill in all fields (liked, didn't like, thoughts, plans)
  - [ ] Click "Save & Finish" button
  - [ ] Verify "Saving..." loading state appears
  - [ ] Verify "Saved! ✓" success message appears
  - [ ] Verify redirect to home page
  - [ ] Verify entry appears in history

- [ ] **Rating slider**
  - [ ] Move slider to 1.0 → Value shows 1.0
  - [ ] Move slider to 10.0 → Value shows 10.0
  - [ ] Move slider to 5.5 → Value shows 5.5
  - [ ] Verify value updates in real-time

- [ ] **Date selection**
  - [ ] Click date picker
  - [ ] Select different date (past or future)
  - [ ] Verify date updates correctly
  - [ ] Verify date is formatted correctly

- [ ] **Text fields**
  - [ ] Type in "What went well" field
  - [ ] Type in "What didn't go well" field
  - [ ] Type in "Thoughts" field
  - [ ] Type in "Tomorrow's plans" field
  - [ ] Verify all fields save correctly
  - [ ] Verify character counts update (if implemented)
  - [ ] Test very long text (10,000+ chars) → Handles correctly

- [ ] **Validation**
  - [ ] Try to save with invalid date → Error shows
  - [ ] Try to save with rating outside 1-10 → Clamped correctly
  - [ ] Try to save with text exceeding max length → Error shows

### 2.2 Voice Recording
- [ ] **Voice-to-text functionality**
  - [ ] Click microphone button on any text field
  - [ ] Verify browser requests microphone permission
  - [ ] Grant permission
  - [ ] Verify "Recording..." indicator appears
  - [ ] Speak into microphone
  - [ ] Verify text appears in real-time as you speak
  - [ ] Click stop button
  - [ ] Verify recording stops
  - [ ] Verify text is saved to field
  - [ ] Verify "Stop Recording" text appears on button during recording

- [ ] **Voice recording offline**
  - [ ] Turn off internet/WiFi
  - [ ] Try to click microphone button
  - [ ] Verify button is disabled (grayed out)
  - [ ] Verify error message: "Voice-to-text requires an internet connection"
  - [ ] Turn internet back on
  - [ ] Verify button re-enables

- [ ] **Permission handling**
  - [ ] Deny microphone permission
  - [ ] Try to use voice recording
  - [ ] Verify clear error message appears
  - [ ] Verify user can still type manually

- [ ] **Long recordings**
  - [ ] Record for 5+ minutes continuously
  - [ ] Verify app doesn't crash
  - [ ] Verify text continues to appear
  - [ ] Verify recording can be stopped successfully

### 2.3 AI Grammar Cleanup
- [ ] **AI cleanup toggle**
  - [ ] Type messy text (voice-to-text style with errors)
  - [ ] Enable "AI cleanup" toggle
  - [ ] Verify text is cleaned up
  - [ ] Verify "Cleaning up..." indicator appears
  - [ ] Verify cleaned text is grammatically correct
  - [ ] Verify original meaning is preserved

- [ ] **AI cleanup offline**
  - [ ] Turn off internet/WiFi
  - [ ] Try to enable AI cleanup
  - [ ] Verify toggle is disabled
  - [ ] Verify message: "AI cleanup requires an internet connection"
  - [ ] Turn internet back on
  - [ ] Verify toggle re-enables

- [ ] **AI cleanup errors**
  - [ ] Enable AI cleanup with API key invalid/expired
  - [ ] Verify error message is user-friendly
  - [ ] Verify app doesn't crash
  - [ ] Verify user can still save journal without cleanup

### 2.4 Edit Existing Journal Entry
- [ ] **Edit entry**
  - [ ] Create a journal entry
  - [ ] Go to History page
  - [ ] Click on an entry to view details
  - [ ] Click "Edit Entry" button
  - [ ] Verify redirect to `/journal` page with entry data loaded
  - [ ] Verify all fields are populated correctly
  - [ ] Modify some fields
  - [ ] Click "Save & Finish" button
  - [ ] Verify "Saving..." loading state appears
  - [ ] Verify success message appears
  - [ ] Verify changes are saved
  - [ ] Verify entry shows updated content in history
  - [ ] Verify streak does NOT change (edits don't affect streak)

- [ ] **Edit entry offline**
  - [ ] Load existing entry for editing
  - [ ] Turn off internet
  - [ ] Make changes
  - [ ] Try to save
  - [ ] Verify saves as draft (if implemented)
  - [ ] Turn internet back on
  - [ ] Verify draft syncs correctly

### 2.5 Delete Journal Entry
- [ ] **Delete entry**
  - [ ] Create a journal entry
  - [ ] Go to journal entry form (editing mode)
  - [ ] Click "Delete Entry" button
  - [ ] Verify confirmation dialog appears
  - [ ] Click "Cancel" → Entry not deleted
  - [ ] Click "Delete Entry" again
  - [ ] Click "OK" in confirmation dialog
  - [ ] Verify "Deleting..." loading state appears
  - [ ] Verify entry is deleted
  - [ ] Verify redirect to home page
  - [ ] Verify entry no longer appears in history
  - [ ] Verify streak does NOT change (deletes don't affect streak)

- [ ] **Clear all fields (new entry)**
  - [ ] Start new journal entry
  - [ ] Fill in some fields
  - [ ] Click "Clear All" button
  - [ ] Verify confirmation dialog appears
  - [ ] Click "OK"
  - [ ] Verify all fields are cleared
  - [ ] Verify entry is not saved

---

## 🔥 SECTION 3: STREAK TRACKING

### 3.1 Streak Calculation
- [ ] **First journal (streak = 1)**
  - [ ] Create account and verify email
  - [ ] Create first journal entry
  - [ ] Verify streak shows 1 day
  - [ ] Verify fire emoji appears

- [ ] **Consecutive days (streak increases)**
  - [ ] Create journal on Day 1
  - [ ] Wait until next day (or change date)
  - [ ] Create journal on Day 2
  - [ ] Verify streak increases to 2 days
  - [ ] Verify pulse animation appears (if implemented)
  - [ ] Continue for 3+ days to verify streak increments correctly

- [ ] **Same day (streak unchanged)**
  - [ ] Create journal entry
  - [ ] Create another journal entry same day
  - [ ] Verify streak does NOT increase
  - [ ] Verify message: "Already journaled today" (if shown)

- [ ] **Broken streak (streak resets)**
  - [ ] Create journal on Day 1
  - [ ] Skip one day (don't journal)
  - [ ] Create journal on Day 3 (2 days later)
  - [ ] Verify streak resets to 1 day
  - [ ] Verify message: "Streak reset" (if shown)

- [ ] **Edge case: Day boundary**
  - [ ] Create journal at 11:59 PM
  - [ ] Create journal at 12:01 AM (next day)
  - [ ] Verify streak increments correctly (consecutive days)

### 3.2 Streak Display
- [ ] **Home page streak display**
  - [ ] Verify streak shows on home page
  - [ ] Verify current streak number is visible
  - [ ] Verify "Longest: X days" shows (if > current)
  - [ ] Verify fire emoji appears
  - [ ] Verify proper grammar (1 day vs 2+ days)
  - [ ] Verify skeleton loader shows during initial load

- [ ] **Streak animations**
  - [ ] Verify streak fades in on page load
  - [ ] Verify pulse animation when streak increases
  - [ ] Verify fire emoji floats slightly (if implemented)
  - [ ] Verify glow effect for streaks > 7 days (if implemented)

- [ ] **Streak states**
  - [ ] Verify 0 days shows: "Start your streak today!"
  - [ ] Verify 1 day shows: "1 day streak"
  - [ ] Verify 2+ days shows: "X days streak"
  - [ ] Verify fire emoji is grayed out for 0 streak (if implemented)

### 3.3 Milestone Celebrations
- [ ] **7-day milestone**
  - [ ] Create 7 consecutive journal entries
  - [ ] Verify milestone message appears
  - [ ] Verify confetti animation appears (if implemented)
  - [ ] Verify toast notification shows

- [ ] **30-day milestone**
  - [ ] Create 30 consecutive journal entries (or test with modified date)
  - [ ] Verify milestone message appears
  - [ ] Verify celebration animation

- [ ] **100-day milestone**
  - [ ] Test 100-day milestone (or simulate)
  - [ ] Verify milestone message appears
  - [ ] Verify celebration animation

- [ ] **New personal record**
  - [ ] Create new longest streak
  - [ ] Verify "New personal record!" message appears
  - [ ] Verify confetti animation appears
  - [ ] Verify longest streak updates correctly

---

## 📚 SECTION 4: HISTORY PAGE

### 4.1 View Past Journals
- [ ] **Journal list display**
  - [ ] Create multiple journal entries (5+)
  - [ ] Go to History page (`/history`)
  - [ ] Verify all entries are displayed
  - [ ] Verify entries are sorted by date (newest first)
  - [ ] Verify skeleton loader shows during initial load
  - [ ] Verify entries fade in smoothly

- [ ] **Journal card display**
  - [ ] Verify each entry shows date correctly
  - [ ] Verify each entry shows rating correctly
  - [ ] Verify preview text is shown (truncated if long)
  - [ ] Verify cards are clickable
  - [ ] Verify hover effect works (if implemented)

- [ ] **Entry detail view**
  - [ ] Click on a journal entry card
  - [ ] Verify detail view opens
  - [ ] Verify all fields are displayed correctly
  - [ ] Verify "Back to Journals" button works
  - [ ] Verify "Edit Entry" button works

- [ ] **Empty state**
  - [ ] Create new account (no journals)
  - [ ] Go to History page
  - [ ] Verify empty state message appears
  - [ ] Verify "Create Your First Entry" button works

### 4.2 Pagination
- [ ] **Pagination functionality**
  - [ ] Create 25+ journal entries (more than 20)
  - [ ] Go to History page
  - [ ] Verify first 20 entries load
  - [ ] Verify "Load More" button appears
  - [ ] Click "Load More" button
  - [ ] Verify "Loading more..." state appears
  - [ ] Verify next 20 entries load
  - [ ] Verify all entries are appended to list
  - [ ] Verify "Load More" button disappears when no more entries

- [ ] **Pagination edge cases**
  - [ ] Create exactly 20 entries → No "Load More" button
  - [ ] Create exactly 21 entries → "Load More" shows, loads 1 more
  - [ ] Create 50+ entries → Multiple "Load More" clicks work

### 4.3 Search Functionality
- [ ] **Search by date**
  - [ ] Go to History page
  - [ ] Click search/date picker
  - [ ] Select a specific date
  - [ ] Verify only entries from that date are shown
  - [ ] Verify "Clear" button appears
  - [ ] Click "Clear" button
  - [ ] Verify all entries are shown again

- [ ] **Search edge cases**
  - [ ] Search for date with no entries → Empty state shows
  - [ ] Search for date with one entry → Only that entry shows
  - [ ] Search for date with multiple entries → All entries from that date show

---

## ⚙️ SECTION 5: SETTINGS PAGE

### 5.1 Data Export
- [ ] **Export data**
  - [ ] Create multiple journal entries (10+)
  - [ ] Go to Settings page
  - [ ] Scroll to "Download My Data" section
  - [ ] Click "Download My Data" button
  - [ ] Verify "Preparing download..." loading state appears
  - [ ] Verify file downloads automatically
  - [ ] Open downloaded JSON file
  - [ ] Verify file contains all entries
  - [ ] Verify file contains metadata (export date, user email, total journals)
  - [ ] Verify file contains streak data
  - [ ] Verify file format is readable/pretty-printed
  - [ ] Verify file name includes date
  - [ ] Verify success toast message appears

- [ ] **Export validation**
  - [ ] Verify exported data matches current data
  - [ ] Verify all fields are included (date, rating, all text fields)
  - [ ] Verify data is sorted (newest first)
  - [ ] Verify no empty objects in export

### 5.2 Notification Settings
- [ ] **Enable notifications**
  - [ ] Go to Settings page
  - [ ] Scroll to "Daily Reminders" section
  - [ ] Verify permission status shows
  - [ ] Click "Enable Notifications" button (if permission not granted)
  - [ ] Verify "Requesting..." loading state appears
  - [ ] Grant permission in browser
  - [ ] Verify success message appears
  - [ ] Verify toggle appears

- [ ] **Toggle notifications**
  - [ ] Toggle notifications ON
  - [ ] Verify toggle animates to ON position
  - [ ] Verify success message appears
  - [ ] Toggle notifications OFF
  - [ ] Verify toggle animates to OFF position
  - [ ] Verify success message appears

- [ ] **Time selection**
  - [ ] Enable notifications
  - [ ] Change hour (e.g., 9 → 10)
  - [ ] Change minute (e.g., 0 → 30)
  - [ ] Click outside time inputs (onBlur)
  - [ ] Verify time saves automatically
  - [ ] Verify success message appears
  - [ ] Refresh page
  - [ ] Verify time persists correctly

- [ ] **Notification errors**
  - [ ] Deny notification permission
  - [ ] Verify clear error message appears
  - [ ] Verify user can still use app
  - [ ] Verify notification toggle is disabled

- [ ] **Notification scheduling**
  - [ ] Enable notifications
  - [ ] Set time to 1 minute from now
  - [ ] Wait for notification (or test on scheduled time)
  - [ ] Verify notification appears at correct time
  - [ ] Click notification (if supported)
  - [ ] Verify app opens (if implemented)

### 5.3 Account Deletion
- [ ] **Delete account flow**
  - [ ] Go to Settings page
  - [ ] Scroll to "Delete My Account" section
  - [ ] Click "Delete My Account" button
  - [ ] Verify confirmation dialog appears
  - [ ] Verify password field appears
  - [ ] Enter password
  - [ ] Click "Cancel" → Dialog closes, account not deleted
  - [ ] Click "Delete My Account" again
  - [ ] Enter correct password
  - [ ] Click "Confirm Delete" button
  - [ ] Verify "Deleting account..." loading state appears
  - [ ] Verify success message appears
  - [ ] Verify redirect to goodbye/login page
  - [ ] Verify user is logged out
  - [ ] Try to log in with deleted account → Fails
  - [ ] Create new account with same email → Success (if allowed)

- [ ] **Delete account validation**
  - [ ] Try to delete without password → Error shows
  - [ ] Try to delete with wrong password → Error shows
  - [ ] Verify all user data is deleted (journals, streak, preferences)

### 5.4 Sign Out
- [ ] **Sign out from settings**
  - [ ] Go to Settings page
  - [ ] Scroll to "Sign Out" section
  - [ ] Click "Sign Out" button
  - [ ] Verify redirect to login page
  - [ ] Verify user is logged out
  - [ ] Try to access protected page → Redirects to login

### 5.5 Legal Links
- [ ] **Privacy Policy link**
  - [ ] Go to Settings page
  - [ ] Scroll to "Legal" section
  - [ ] Click "Privacy Policy" link
  - [ ] Verify redirect to `/privacy` page
  - [ ] Verify content is readable
  - [ ] Verify contact email is correct (`kakhadzevano@gmail.com`)
  - [ ] Navigate back to settings

- [ ] **Terms of Service link**
  - [ ] Go to Settings page
  - [ ] Scroll to "Legal" section
  - [ ] Click "Terms of Service" link
  - [ ] Verify redirect to `/terms` page
  - [ ] Verify content is readable
  - [ ] Verify contact email is correct (`kakhadzevano@gmail.com`)
  - [ ] Navigate back to settings

---

## 📱 SECTION 6: OFFLINE FUNCTIONALITY

### 6.1 Offline Detection
- [ ] **Offline banner**
  - [ ] Turn off internet/WiFi
  - [ ] Verify "You're offline - Your work is being saved locally" banner appears
  - [ ] Verify banner is visible on all pages
  - [ ] Turn internet back on
  - [ ] Verify banner disappears

- [ ] **Online/offline indicator**
  - [ ] Verify online indicator shows (green dot) when online
  - [ ] Verify offline indicator shows (orange dot) when offline
  - [ ] Verify indicator is visible on relevant pages

### 6.2 Draft Saving
- [ ] **Auto-save draft**
  - [ ] Go to journal entry form
  - [ ] Turn off internet
  - [ ] Type in journal entry fields
  - [ ] Verify draft saves automatically (debounced after 2 seconds)
  - [ ] Verify no error messages appear

- [ ] **Save journal offline**
  - [ ] Fill in journal entry form
  - [ ] Turn off internet
  - [ ] Click "Save & Finish" button
  - [ ] Verify saves as draft
  - [ ] Verify message: "You are offline. Your work is being saved locally..."
  - [ ] Turn internet back on
  - [ ] Verify draft syncs automatically (if implemented)

- [ ] **Restore draft**
  - [ ] Create draft (save offline)
  - [ ] Navigate away from journal page
  - [ ] Return to journal page
  - [ ] Verify prompt to restore draft appears
  - [ ] Click "Restore" → Draft loads
  - [ ] Click "Discard" → Draft clears, form is empty

### 6.3 Sync Prompt
- [ ] **Sync draft when back online**
  - [ ] Create draft while offline
  - [ ] Navigate to home page
  - [ ] Turn internet back on
  - [ ] Verify "You're back online!" notification appears
  - [ ] Verify draft age shows (e.g., "just now", "1 hour ago")
  - [ ] Click "Save Now" button
  - [ ] Verify "Syncing..." state appears
  - [ ] Verify draft syncs to server
  - [ ] Verify draft clears after sync
  - [ ] Verify entry appears in history

- [ ] **Discard draft**
  - [ ] Create draft while offline
  - [ ] Turn internet back on
  - [ ] When sync prompt appears, click "Discard"
  - [ ] Verify draft is cleared
  - [ ] Verify no entry is saved

### 6.4 Offline Restrictions
- [ ] **Voice-to-text offline**
  - [ ] Turn off internet
  - [ ] Go to journal entry form
  - [ ] Verify microphone button is disabled (grayed out)
  - [ ] Verify error message if clicked: "Voice-to-text requires an internet connection"
  - [ ] Verify user can still type manually

- [ ] **AI cleanup offline**
  - [ ] Turn off internet
  - [ ] Go to journal entry form
  - [ ] Verify AI cleanup toggle is disabled
  - [ ] Verify message: "AI cleanup requires an internet connection"
  - [ ] Verify user can still save journal without cleanup

- [ ] **History page offline**
  - [ ] Turn off internet
  - [ ] Go to History page
  - [ ] Verify existing entries still show (cached)
  - [ ] Verify pagination/loading shows error (if needed)

---

## 🔄 SECTION 7: ERROR HANDLING

### 7.1 Network Errors
- [ ] **Save journal during network error**
  - [ ] Fill in journal entry form
  - [ ] Turn off internet
  - [ ] Click "Save & Finish" button
  - [ ] Verify error message appears
  - [ ] Verify "Retry" button appears (if implemented)
  - [ ] Verify draft is saved (if implemented)
  - [ ] Turn internet back on
  - [ ] Click "Retry" button
  - [ ] Verify journal saves successfully

- [ ] **Load journals during network error**
  - [ ] Turn off internet
  - [ ] Navigate to History page
  - [ ] Verify error message appears (if no cached data)
  - [ ] Verify "Retry" button appears
  - [ ] Turn internet back on
  - [ ] Click "Retry" button
  - [ ] Verify journals load successfully

- [ ] **API errors**
  - [ ] Enable AI cleanup
  - [ ] Disconnect internet or break API connection
  - [ ] Try to use AI cleanup
  - [ ] Verify user-friendly error message appears
  - [ ] Verify app doesn't crash
  - [ ] Verify user can still save journal

### 7.2 Validation Errors
- [ ] **Form validation**
  - [ ] Try to submit empty required fields → Error shows
  - [ ] Try invalid email format → Error shows
  - [ ] Try password < 8 chars → Error shows
  - [ ] Try mismatched passwords → Error shows
  - [ ] Try rating outside 1-10 → Clamped correctly
  - [ ] Verify all error messages are clear and helpful

- [ ] **Character limits**
  - [ ] Try to enter text exceeding max length (if implemented)
  - [ ] Verify error message appears
  - [ ] Verify character counter updates (if implemented)

### 7.3 Session Errors
- [ ] **Session expired**
  - [ ] Log in successfully
  - [ ] Wait for session to expire (or manually expire)
  - [ ] Try to navigate to protected page
  - [ ] Verify redirect to login with message
  - [ ] Log in again
  - [ ] Verify redirect back to original page

- [ ] **Invalid session**
  - [ ] Manually corrupt session (dev tools)
  - [ ] Try to use app
  - [ ] Verify redirect to login
  - [ ] Verify clear error message

### 7.4 Database Errors
- [ ] **Connection errors**
  - [ ] Simulate database connection error (if possible)
  - [ ] Try to save journal entry
  - [ ] Verify user-friendly error message appears
  - [ ] Verify app doesn't crash
  - [ ] Verify draft is saved (if implemented)

- [ ] **Data errors**
  - [ ] Try to save invalid data (if possible)
  - [ ] Verify validation catches errors
  - [ ] Verify error messages are clear

---

## 🎨 SECTION 8: UI/UX & LOADING STATES

### 8.1 Loading States
- [ ] **Login page**
  - [ ] Click "Sign In" button → "Logging in..." appears
  - [ ] Verify button is disabled during loading
  - [ ] Verify spinner appears

- [ ] **Signup page**
  - [ ] Click "Create Account" button → "Creating account..." appears
  - [ ] Verify button is disabled during loading

- [ ] **Forgot password page**
  - [ ] Click "Send reset link" button → "Sending..." appears
  - [ ] Verify button is disabled during loading

- [ ] **Reset password page**
  - [ ] Click "Reset password" button → "Resetting..." appears
  - [ ] Verify button is disabled during loading

- [ ] **Journal entry form**
  - [ ] Click "Save & Finish" button → "Saving..." appears
  - [ ] Verify button is disabled during loading
  - [ ] Verify "Deleting..." appears when deleting entry
  - [ ] Verify "Recording..." text appears during voice recording
  - [ ] Verify "Cleaning up..." appears during AI cleanup

- [ ] **History page**
  - [ ] Verify skeleton loader appears on initial load
  - [ ] Verify "Loading more..." appears when clicking "Load More"
  - [ ] Verify smooth fade-in when entries load

- [ ] **Settings page**
  - [ ] Click "Download My Data" → "Preparing download..." appears
  - [ ] Click "Confirm Delete" → "Deleting account..." appears
  - [ ] Verify toggles show loading state (if implemented)

### 8.2 Empty States
- [ ] **No journals**
  - [ ] Create new account
  - [ ] Go to History page
  - [ ] Verify empty state message appears
  - [ ] Verify "Create Your First Entry" button works

- [ ] **No search results**
  - [ ] Search for date with no entries
  - [ ] Verify empty state message appears
  - [ ] Verify "Create Entry for This Date" button works

- [ ] **No streak (0 days)**
  - [ ] Create new account
  - [ ] Go to home page
  - [ ] Verify "Start your streak today!" message appears

### 8.3 Success Messages
- [ ] **Journal saved**
  - [ ] Save journal entry
  - [ ] Verify success message appears (if implemented)
  - [ ] Verify streak feedback appears (if applicable)

- [ ] **Data exported**
  - [ ] Export data
  - [ ] Verify success toast message appears

- [ ] **Password reset**
  - [ ] Request password reset
  - [ ] Verify success message appears

- [ ] **Account deleted**
  - [ ] Delete account
  - [ ] Verify goodbye message appears

---

## 🌐 SECTION 9: NAVIGATION & ROUTING

### 9.1 Page Navigation
- [ ] **Home page**
  - [ ] Navigate to `/` → Home page loads
  - [ ] Verify all elements are visible
  - [ ] Verify "Start Journaling" button works
  - [ ] Verify "History" button works
  - [ ] Verify "Settings" button works

- [ ] **Journal page**
  - [ ] Navigate to `/journal` → Journal form loads
  - [ ] Verify all form fields are visible
  - [ ] Verify "Back" button works (if implemented)

- [ ] **History page**
  - [ ] Navigate to `/history` → History page loads
  - [ ] Verify "Back to Home" button works

- [ ] **Settings page**
  - [ ] Navigate to `/settings` → Settings page loads
  - [ ] Verify all sections are visible

- [ ] **Login page**
  - [ ] Navigate to `/login` → Login page loads
  - [ ] Verify "Sign up" link works
  - [ ] Verify "Forgot password?" link works

- [ ] **Register page**
  - [ ] Navigate to `/register` → Register page loads
  - [ ] Verify "Sign in" link works

- [ ] **Privacy page**
  - [ ] Navigate to `/privacy` → Privacy Policy loads
  - [ ] Verify content is readable

- [ ] **Terms page**
  - [ ] Navigate to `/terms` → Terms of Service loads
  - [ ] Verify content is readable

- [ ] **Forgot password page**
  - [ ] Navigate to `/forgot-password` → Forgot password page loads
  - [ ] Verify "Back to login" link works (if implemented)

- [ ] **Reset password page**
  - [ ] Navigate to `/reset-password` (with valid token) → Reset password page loads
  - [ ] Verify form is visible

### 9.2 Protected Routes
- [ ] **Unauthenticated access**
  - [ ] Log out
  - [ ] Try to navigate to `/journal` → Redirects to `/login`
  - [ ] Try to navigate to `/history` → Redirects to `/login`
  - [ ] Try to navigate to `/settings` → Redirects to `/login`
  - [ ] Try to navigate to `/` → Redirects to `/login`

- [ ] **Authenticated access**
  - [ ] Log in
  - [ ] Verify all protected routes are accessible
  - [ ] Verify redirect after login works correctly

### 9.3 Browser Navigation
- [ ] **Back button**
  - [ ] Navigate through multiple pages
  - [ ] Click browser back button
  - [ ] Verify previous page loads correctly
  - [ ] Verify app state is maintained

- [ ] **Refresh**
  - [ ] Navigate to any page
  - [ ] Refresh page (F5)
  - [ ] Verify page loads correctly
  - [ ] Verify user stays logged in
  - [ ] Verify data persists

---

## 🔒 SECTION 10: SECURITY CHECKS

### 10.1 Data Security
- [ ] **Row-Level Security (RLS)**
  - [ ] Verify RLS is enabled on `journal_entries` table in Supabase
  - [ ] Verify RLS is enabled on `streaks` table in Supabase
  - [ ] Verify RLS is enabled on `user_preferences` table in Supabase
  - [ ] Test: User A cannot access User B's data (manual test)
  - [ ] Test: Direct SQL query as User A for User B's data fails

- [ ] **Data isolation**
  - [ ] Create two accounts
  - [ ] Create journals in Account A
  - [ ] Log in as Account B
  - [ ] Verify Account B cannot see Account A's journals
  - [ ] Verify Account B cannot edit Account A's journals
  - [ ] Verify Account B cannot delete Account A's journals

- [ ] **API security**
  - [ ] Verify all API routes require authentication
  - [ ] Test `/api/cleanup-text` without auth → 401 error
  - [ ] Test `/api/delete-account` without auth → 401 error
  - [ ] Verify API keys are in `.env.local` (not hardcoded)
  - [ ] Verify `.env.local` is in `.gitignore`

### 10.2 Input Validation
- [ ] **SQL injection**
  - [ ] Try SQL injection in text fields (e.g., `'; DROP TABLE journals--`)
  - [ ] Verify input is sanitized/escaped
  - [ ] Verify database is safe

- [ ] **XSS attacks**
  - [ ] Try XSS in text fields (e.g., `<script>alert('xss')</script>`)
  - [ ] Verify script tags are escaped
  - [ ] Verify content displays as text (not executes)

- [ ] **Input sanitization**
  - [ ] Enter special characters in all text fields
  - [ ] Verify special characters are handled correctly
  - [ ] Verify data saves and displays correctly

### 10.3 Authentication Security
- [ ] **Password requirements**
  - [ ] Try password < 8 chars → Rejected
  - [ ] Verify password is hashed (check database)
  - [ ] Verify passwords are never logged

- [ ] **Session security**
  - [ ] Verify sessions expire after configured time
  - [ ] Verify logout clears session completely
  - [ ] Verify session tokens are not exposed in URLs

- [ ] **Email verification**
  - [ ] Try to use app without verifying email
  - [ ] Verify email verification is required (if implemented)
  - [ ] Verify unverified users cannot access protected routes

---

## 📊 SECTION 11: DATA VALIDATION

### 11.1 Journal Entry Validation
- [ ] **Rating validation**
  - [ ] Try rating < 1 → Clamped to 1
  - [ ] Try rating > 10 → Clamped to 10
  - [ ] Try rating = 5.5 → Accepted
  - [ ] Verify rating saves correctly

- [ ] **Date validation**
  - [ ] Try invalid date → Error shows
  - [ ] Try future date → Accepted (or rejected, depending on requirements)
  - [ ] Try past date → Accepted
  - [ ] Verify date saves correctly

- [ ] **Text field validation**
  - [ ] Try empty required fields → Error shows (if required)
  - [ ] Try very long text (10,000+ chars) → Handles correctly
  - [ ] Try special characters → Accepted
  - [ ] Try emojis → Accepted

### 11.2 Form Validation
- [ ] **Email validation**
  - [ ] Try invalid email format → Error shows
  - [ ] Try valid email → Accepted
  - [ ] Try email with special characters → Handled correctly

- [ ] **Password validation**
  - [ ] Try password < 8 chars → Error shows
  - [ ] Try password without uppercase → Requirement unchecked
  - [ ] Try password without lowercase → Requirement unchecked
  - [ ] Try password without number → Requirement unchecked
  - [ ] Try password meeting all requirements → Accepted

---

## 📱 SECTION 12: MOBILE & RESPONSIVE DESIGN

### 12.1 Mobile Layout
- [ ] **Small screen (iPhone SE)**
  - [ ] Test all pages on small screen (375px width)
  - [ ] Verify text is readable
  - [ ] Verify buttons are tappable (44x44px minimum)
  - [ ] Verify no horizontal scrolling
  - [ ] Verify forms fit on screen

- [ ] **Medium screen (iPhone 12/13)**
  - [ ] Test all pages on medium screen (390px width)
  - [ ] Verify layout looks good
  - [ ] Verify all elements are accessible

- [ ] **Large screen (iPhone Pro Max)**
  - [ ] Test all pages on large screen (428px width)
  - [ ] Verify layout scales well
  - [ ] Verify no awkward spacing

- [ ] **Tablet (iPad)**
  - [ ] Test all pages on tablet (768px+ width)
  - [ ] Verify layout adapts correctly
  - [ ] Verify content is not too wide

### 12.2 Touch Interactions
- [ ] **Button taps**
  - [ ] Verify all buttons respond to taps
  - [ ] Verify tap targets are large enough (44x44px)
  - [ ] Verify no accidental taps

- [ ] **Form inputs**
  - [ ] Verify keyboard appears correctly on mobile
  - [ ] Verify keyboard doesn't cover inputs
  - [ ] Verify inputs are easy to tap

- [ ] **Scrolling**
  - [ ] Verify pages scroll smoothly
  - [ ] Verify no scroll jank
  - [ ] Verify long pages scroll correctly

---

## 🎯 SECTION 13: EDGE CASES & STRESS TESTS

### 13.1 Large Data Sets
- [ ] **100+ journal entries**
  - [ ] Create 100+ journal entries (or simulate)
  - [ ] Go to History page
  - [ ] Verify page loads within reasonable time (< 3 seconds)
  - [ ] Verify pagination works correctly
  - [ ] Verify search works correctly
  - [ ] Verify no performance issues

- [ ] **Long text entries**
  - [ ] Create journal entry with 10,000+ characters
  - [ ] Verify entry saves correctly
  - [ ] Verify entry displays correctly
  - [ ] Verify editing works correctly

- [ ] **Many consecutive days**
  - [ ] Create journal entries for 100+ consecutive days
  - [ ] Verify streak shows correctly
  - [ ] Verify milestone celebrations work

### 13.2 Rapid Interactions
- [ ] **Rapid clicks**
  - [ ] Rapidly click "Save" button multiple times
  - [ ] Verify only one save occurs
  - [ ] Verify no duplicate entries created

- [ ] **Rapid navigation**
  - [ ] Rapidly navigate between pages
  - [ ] Verify no race conditions
  - [ ] Verify app doesn't crash

- [ ] **Rapid form changes**
  - [ ] Rapidly change form fields
  - [ ] Verify all changes are captured
  - [ ] Verify save works correctly

### 13.3 Browser Scenarios
- [ ] **Browser refresh during save**
  - [ ] Start saving journal entry
  - [ ] Refresh page mid-save
  - [ ] Verify data is not lost (draft saved, if implemented)
  - [ ] Verify no duplicate entries

- [ ] **Browser back during save**
  - [ ] Start saving journal entry
  - [ ] Click browser back button
  - [ ] Verify app handles gracefully
  - [ ] Verify data is not lost

- [ ] **Tab switching**
  - [ ] Open app in multiple tabs
  - [ ] Make changes in one tab
  - [ ] Verify changes are reflected (if implemented)
  - [ ] Verify no conflicts

### 13.4 Network Scenarios
- [ ] **Slow connection**
  - [ ] Simulate slow 3G connection
  - [ ] Test all features
  - [ ] Verify loading states appear
  - [ ] Verify timeouts are reasonable

- [ ] **Connection drops**
  - [ ] Start action (save journal)
  - [ ] Drop connection mid-action
  - [ ] Verify error handling works
  - [ ] Verify retry works (if implemented)

- [ ] **Connection restored**
  - [ ] Start action while offline
  - [ ] Restore connection
  - [ ] Verify sync works (if implemented)

---

## 🧪 SECTION 14: CROSS-BROWSER TESTING

### 14.1 Chrome/Edge
- [ ] Test all features in Chrome
- [ ] Test all features in Edge
- [ ] Verify no console errors
- [ ] Verify all animations work

### 14.2 Safari
- [ ] Test all features in Safari (if available)
- [ ] Verify voice recording works
- [ ] Verify notifications work (if on Mac)
- [ ] Verify no Safari-specific issues

### 14.3 Firefox
- [ ] Test all features in Firefox (if available)
- [ ] Verify no Firefox-specific issues
- [ ] Verify all features work

---

## ⏱️ SECTION 15: PERFORMANCE

### 15.1 Page Load Times
- [ ] **Initial load**
  - [ ] Measure time to first contentful paint
  - [ ] Verify < 3 seconds on fast connection
  - [ ] Verify < 5 seconds on slow connection

- [ ] **Navigation**
  - [ ] Measure time between page navigations
  - [ ] Verify < 1 second on fast connection
  - [ ] Verify smooth transitions

### 15.2 Interaction Responsiveness
- [ ] **Button clicks**
  - [ ] Verify buttons respond immediately (< 100ms)
  - [ ] Verify loading states appear quickly

- [ ] **Form inputs**
  - [ ] Verify inputs respond immediately
  - [ ] Verify no lag when typing

- [ ] **Animations**
  - [ ] Verify animations are smooth (60fps)
  - [ ] Verify no jank or stuttering

---

## ✅ SECTION 16: FINAL CHECKS

### 16.1 Documentation
- [ ] Verify README is updated (if exists)
- [ ] Verify Privacy Policy is complete
- [ ] Verify Terms of Service is complete
- [ ] Verify contact email is correct (`kakhadzevano@gmail.com`)

### 16.2 Environment Variables
- [ ] Verify `.env.local` exists
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Verify all required environment variables are set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `GEMINI_API_KEY`
- [ ] Verify no API keys are hardcoded

### 16.3 Build & Deployment
- [ ] Verify `npm run build` succeeds
- [ ] Verify no build errors or warnings
- [ ] Verify all routes build correctly
- [ ] Verify production build works
- [ ] Verify deployment is configured (if deploying)

### 16.4 Database
- [ ] Verify all tables exist in Supabase:
  - [ ] `journal_entries`
  - [ ] `streaks`
  - [ ] `user_preferences`
- [ ] Verify RLS is enabled on all tables
- [ ] Verify RLS policies are correct
- [ ] Verify indexes are created (if needed)

---

## 📝 TESTING NOTES

**Issues Found:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Critical Issues (Block Launch):**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Minor Issues (Fix Post-Launch):**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Testing Date:** _______________  
**Tester:** _______________  
**Status:** ⬜ Passed  ⬜ Failed  ⬜ Needs Retest

---

## ⏱️ TIME ESTIMATE

**Total Estimated Time:** 4-6 hours

**Breakdown:**
- Authentication & Security: 45 minutes
- Journal Entry Features: 60 minutes
- Streak Tracking: 30 minutes
- History Page: 30 minutes
- Settings Page: 45 minutes
- Offline Functionality: 30 minutes
- Error Handling: 30 minutes
- UI/UX & Loading States: 30 minutes
- Navigation & Routing: 20 minutes
- Security Checks: 30 minutes
- Data Validation: 20 minutes
- Mobile & Responsive: 30 minutes
- Edge Cases & Stress Tests: 30 minutes
- Cross-Browser Testing: 30 minutes
- Performance: 20 minutes
- Final Checks: 20 minutes

**Recommendation:**
- Test in multiple sessions (2-3 hours per session)
- Focus on critical paths first (auth, journal creation, data saving)
- Use this checklist systematically, don't skip items
- Take notes on any issues found
- Re-test critical fixes before launch

---

## 🎯 PRIORITY TESTING (If Time Limited)

If you have limited time, focus on these **critical paths** first:

1. **User Registration & Login** (30 min)
   - [ ] Sign up works
   - [ ] Email verification works
   - [ ] Login works
   - [ ] Logout works

2. **Journal Creation** (45 min)
   - [ ] Create journal entry works
   - [ ] Save works
   - [ ] Edit works
   - [ ] Delete works
   - [ ] Voice recording works
   - [ ] Offline save works

3. **Streak Tracking** (15 min)
   - [ ] Streak increments correctly
   - [ ] Streak displays correctly

4. **Data Security** (30 min)
   - [ ] RLS is enabled
   - [ ] Users cannot access each other's data
   - [ ] API routes require authentication

5. **Settings & Account** (30 min)
   - [ ] Export data works
   - [ ] Delete account works
   - [ ] Sign out works

**Minimum Testing Time:** 2.5 hours

---

**Good luck with testing! 🚀**


