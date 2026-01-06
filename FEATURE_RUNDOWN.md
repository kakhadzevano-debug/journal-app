# Simply Journal - Complete Feature Rundown & Technical Documentation

## 📋 Table of Contents
1. [External Platforms & Services](#external-platforms--services)
2. [Database Structure](#database-structure)
3. [Complete Feature List](#complete-feature-list)
4. [How Everything Works](#how-everything-works)
5. [Technical Architecture](#technical-architecture)
6. [Security Features](#security-features)
7. [Error Handling](#error-handling)
8. [Data Validation](#data-validation)

---

## 🌐 External Platforms & Services

### 1. **Supabase** (Primary Backend)
- **Purpose**: Database, Authentication, Row-Level Security (RLS)
- **Usage**:
  - PostgreSQL database for storing journal entries, streaks, and user preferences
  - Email/password authentication with email verification
  - Row-Level Security policies to ensure users can only access their own data
  - Real-time capabilities (not currently used, but available)
- **Configuration**: 
  - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public/anonymous key (safe for client)
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only, for admin operations)
- **Cost**: Free tier available, paid plans for production scale

### 2. **Google Gemini API** (AI Text Cleanup)
- **Purpose**: AI-powered grammar and punctuation correction for voice-to-text transcriptions
- **Model**: `gemini-1.5-flash` (fast, cost-effective)
- **Usage**: Server-side API route (`/api/cleanup-text`) processes voice transcriptions
- **Configuration**: `GEMINI_API_KEY` (server-side only, stored in `.env.local`)
- **Cost**: ~$0.0001-0.0002 per journal entry (very cheap)
- **Security**: API key never exposed to browser, all requests go through Next.js API route

### 3. **Next.js 16** (Framework)
- **Purpose**: React framework for server-side rendering and API routes
- **Version**: 16.1.1
- **Features Used**:
  - App Router (file-based routing)
  - Server Components & Client Components
  - API Routes (server-side endpoints)
  - Middleware (authentication checks)
  - Server-Side Rendering (SSR)

### 4. **Browser APIs**
- **Web Speech API**: Voice-to-text transcription (Chrome, Edge, Safari)
- **Notifications API**: Daily reminder notifications
- **Service Worker**: Notification scheduling (when implemented as PWA)

### 5. **React 19** (UI Library)
- **Purpose**: User interface components
- **Version**: 19.2.3
- **Features**: Hooks, Context API, Suspense

### 6. **Framer Motion** (Animations)
- **Purpose**: Smooth animations and transitions
- **Version**: 12.23.26
- **Usage**: Page transitions, button animations, confetti effects, streak celebrations

---

## 💾 Database Structure

### Tables:

#### 1. **journal_entries**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `date` (DATE) - The date the journal entry is for
- `rating` (DECIMAL) - Day rating (1-10)
- `liked` (TEXT) - What the user liked today
- `didnt_like` (TEXT) - What the user didn't like
- `other_thoughts` (TEXT) - Additional thoughts
- `tomorrow_plans` (TEXT) - Plans for tomorrow
- `created_at` (TIMESTAMPTZ) - When entry was created (for streak tracking)
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Row-Level Security (RLS)**:
- Users can only SELECT, INSERT, UPDATE, DELETE their own entries
- Policy: `auth.uid() = user_id`

#### 2. **streaks**
- `user_id` (UUID, Primary Key, Foreign Key → auth.users)
- `current_streak` (INTEGER) - Current consecutive days
- `longest_streak` (INTEGER) - Personal best streak
- `last_journal_created_at` (TIMESTAMPTZ) - Last journal creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Row-Level Security (RLS)**:
- Users can only view and update their own streak
- Policy: `auth.uid() = user_id`

#### 3. **user_preferences**
- `user_id` (UUID, Primary Key, Foreign Key → auth.users)
- `notifications_enabled` (BOOLEAN) - Whether notifications are on
- `notification_hour` (INTEGER) - Hour for daily reminder (0-23)
- `notification_minute` (INTEGER) - Minute for daily reminder (0-59)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**Row-Level Security (RLS)**:
- Users can only view and update their own preferences
- Policy: `auth.uid() = user_id`

#### 4. **auth.users** (Supabase Auth)
- Managed by Supabase
- Stores user accounts, email, password hash
- Email verification required

---

## ✨ Complete Feature List

### **1. User Authentication**
- ✅ **Sign Up**: Email/password registration
  - Email verification required
  - Password minimum 8 characters
  - User-friendly error messages
  - Post-signup message to check email
- ✅ **Sign In**: Email/password login
  - Session management
  - Persistent authentication
  - Clear error messages
- ✅ **Sign Out**: Logout functionality
  - Clears session
  - Redirects to login
  - Located in Settings page
- ✅ **Email Verification**: Required before account is fully active
- ✅ **Protected Routes**: Middleware redirects unauthenticated users
- ✅ **Session Persistence**: Authentication state maintained across page refreshes

### **2. Journal Entry Creation**
- ✅ **Voice-to-Text Recording**:
  - Browser Speech Recognition API
  - Continuous recording until manually stopped
  - Real-time transcription display
  - Visual waveform animation during recording
  - Microphone permission handling
  - Fallback to typing if microphone unavailable
- ✅ **AI Text Cleanup**:
  - Automatic grammar and punctuation correction
  - Uses Google Gemini 1.5 Flash model
  - Fixes common voice-to-text errors
  - Maintains authentic journal voice
  - Server-side processing (API key secure)
- ✅ **Manual Text Input**:
  - Multiple text fields (liked, didn't like, thoughts, plans)
  - Character counters (10,000 char limit per field)
  - Auto-resizing textareas
  - Real-time validation
- ✅ **Rating System**:
  - Slider input (1-10 scale)
  - Visual feedback
  - Optional field
- ✅ **Date Selection**:
  - Date picker for journal entry date
  - Defaults to today
  - Can select past dates
  - Validation (1900-2100 range)
- ✅ **Save Journal**:
  - Server-side validation
  - Client-side validation
  - Error handling with retry
  - Success animation
  - Streak update on new entries
  - Toast notifications for streak feedback

### **3. Journal Entry Editing**
- ✅ **Edit Existing Entries**:
  - Load entry by ID
  - Pre-fill all fields
  - Update existing entry (doesn't create new)
  - Streak NOT affected by edits
  - Same validation as creation
- ✅ **Entry Detection**:
  - Checks if entry exists for selected date
  - Warns if overwriting existing entry
  - Loads existing entry automatically

### **4. Journal Entry Deletion**
- ✅ **Delete Entry**:
  - Confirmation dialog
  - Permanent deletion from database
  - Streak NOT affected by deletion
  - Redirects to home after deletion
- ✅ **Clear Form**:
  - Clear all fields without saving
  - Confirmation dialog

### **5. Journal History & Viewing**
- ✅ **View All Entries**:
  - List of all journal entries
  - Sorted by date (newest first)
  - Displays date, rating, preview
  - Click to view full entry
- ✅ **Search by Date**:
  - Date picker filter
  - Real-time filtering
  - Clear search option
- ✅ **View Individual Entry**:
  - Full entry details
  - Edit button
  - Delete button
  - Back to list
- ✅ **Entry Display**:
  - Formatted dates
  - Rating display
  - All text fields shown
  - Glass-morphism card design

### **6. Streak Tracking**
- ✅ **Current Streak**:
  - Tracks consecutive days of journaling
  - Based on journal creation timestamp
  - Updates only on NEW journal creation
  - NOT affected by edits or deletions
  - Resets if day skipped
  - Multiple journals same day don't increase streak
- ✅ **Longest Streak**:
  - Tracks personal best
  - Updates automatically
  - Displays on home page
- ✅ **Streak Display**:
  - Large number with fire emoji 🔥
  - Animated counter (smooth transitions)
  - Pulse animation on increase
  - Glow effect for streaks ≥7 days
  - Gray/disabled for 0 streak
  - Shows "day" vs "days" (singular/plural)
  - "Longest: X days" subtitle
- ✅ **Streak Logic**:
  - Same day: No change (already journaled)
  - Yesterday: Increment by 1
  - 2+ days ago: Reset to 1
  - First journal: Set to 1
  - Timezone-aware (uses local timezone)
- ✅ **Milestone Celebrations**:
  - 7 days: "One week strong! 💪"
  - 30 days: "One month streak! Amazing! 🎉"
  - 100 days: "100 days! You're incredible! 🏆"
  - New longest streak: "New personal record! 🌟"
  - Confetti animation
  - Toast notifications

### **7. Data Export**
- ✅ **Download My Data**:
  - Exports all journal entries as JSON
  - Includes: dates, ratings, all text fields
  - Includes streak data (current, longest)
  - Includes metadata (creation dates, export date, user email)
  - Automatic file download
  - Success toast notification
  - Located in Settings page

### **8. Account Management**
- ✅ **Delete My Account**:
  - Confirmation dialog ("This cannot be undone")
  - Password re-entry required
  - Deletes all journal entries
  - Deletes streak data
  - Deletes user preferences
  - Deletes user account
  - Logs user out
  - Shows goodbye message
  - Located in Settings page

### **9. Daily Notification Reminders**
- ✅ **Notification Settings**:
  - Enable/disable toggle
  - Time picker (hour and minute)
  - Permission request button
  - Status messages
  - Saves preferences to database
- ✅ **Notification Scheduling**:
  - Daily reminders at selected time
  - Uses browser Notifications API
  - Only shows if permission granted
  - Doesn't show if app is in focus (not annoying)
  - Schedules next day automatically
- ✅ **Permission Management**:
  - Request permission button
  - Status display (granted, denied, default)
  - User-friendly messages
  - Handles unsupported browsers gracefully

### **10. Legal Pages**
- ✅ **Privacy Policy** (`/privacy`):
  - Explains data collection
  - Data storage and security
  - Who can access data (only user)
  - How to delete data
  - Contact email (kakhadzevano@gmail.com)
  - Accessible from Settings and Sign Up
- ✅ **Terms of Service** (`/terms`):
  - User responsibilities
  - Liability limits
  - Account rules
  - Contact email
  - Accessible from Settings and Sign Up

### **11. Error Handling**
- ✅ **Network Errors**:
  - Detects offline status
  - User-friendly messages
  - Retry buttons
  - Graceful degradation
- ✅ **Database Errors**:
  - Connection error handling
  - Table not found errors
  - Permission errors (RLS)
  - User-friendly messages
  - Logs technical details (development only)
- ✅ **Authentication Errors**:
  - Session expired handling
  - Invalid credentials
  - Clear error messages
  - Automatic redirects
- ✅ **Validation Errors**:
  - Client-side validation
  - Server-side validation
  - Specific error messages
  - Prevents invalid data submission
- ✅ **Voice Recording Errors**:
  - Microphone permission denied
  - Browser not supported
  - Fallback to typing
  - Clear error messages

### **12. Data Validation**
- ✅ **Client-Side Validation**:
  - Rating: 1-10 range
  - Text fields: Max 10,000 characters
  - Date: Valid date, 1900-2100 range
  - At least one field required
  - Real-time feedback
- ✅ **Server-Side Validation**:
  - Same rules as client-side
  - Prevents malicious data
  - Sanitizes text input
  - Error handling

### **13. User Interface**
- ✅ **Design**:
  - Dark theme (purple gradient background)
  - Glass-morphism cards
  - Smooth animations (Framer Motion)
  - Responsive design (mobile-friendly)
  - Consistent styling
- ✅ **Animations**:
  - Page transitions
  - Button hover/tap effects
  - Streak pulse on increase
  - Confetti for milestones
  - Toast notifications
  - Success animations
  - Fire emoji floating animation
- ✅ **Accessibility**:
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Screen reader friendly
- ✅ **Responsive Layout**:
  - Mobile-first design
  - Adapts to different screen sizes
  - Touch-friendly buttons
  - Readable text sizes

### **14. Navigation**
- ✅ **Home Page** (`/`):
  - Streak display
  - "Start Journaling" button
  - History button (bottom right)
  - Settings button (bottom left)
  - Sign in button (if not logged in)
- ✅ **Journal Page** (`/journal`):
  - Journal entry form
  - Save/Delete buttons
  - Back to home
  - Edit mode (via URL params)
- ✅ **History Page** (`/history`):
  - List of all entries
  - Search by date
  - View individual entries
  - Edit/Delete buttons
  - Back to home
- ✅ **Settings Page** (`/settings`):
  - Download data button
  - Notification settings
  - Delete account button
  - Sign out button
  - Links to Privacy & Terms
  - Back to home
- ✅ **Auth Pages**:
  - Login (`/login`)
  - Register (`/register`)
  - Links to Privacy & Terms
- ✅ **Legal Pages**:
  - Privacy Policy (`/privacy`)
  - Terms of Service (`/terms`)

---

## 🔧 How Everything Works

### **Authentication Flow**

1. **Sign Up**:
   - User enters email/password on `/register`
   - `AuthProvider.signUp()` calls Supabase `auth.signUp()`
   - Supabase sends verification email
   - User sees message to check email
   - After email verification, user can sign in

2. **Sign In**:
   - User enters email/password on `/login`
   - `AuthProvider.signIn()` calls Supabase `auth.signInWithPassword()`
   - Supabase validates credentials
   - Session created and stored (cookies)
   - User redirected to home page

3. **Session Management**:
   - `AuthProvider` component wraps entire app
   - Listens to auth state changes via Supabase
   - Provides `user`, `loading`, `signUp`, `signIn`, `signOut` to all components
   - Middleware checks authentication on protected routes

### **Journal Entry Creation Flow**

1. **User clicks "Start Journaling"** → Navigates to `/journal`

2. **Form Loads**:
   - Date defaults to today
   - Rating defaults to 5.0
   - Text fields empty
   - Checks if entry exists for selected date

3. **Voice Recording** (optional):
   - User clicks microphone button
   - Browser requests microphone permission
   - Web Speech API starts recording
   - Real-time transcription displayed
   - User clicks stop to end recording
   - Text automatically cleaned by AI (Gemini API)
   - Cleaned text fills textarea

4. **Manual Input** (alternative):
   - User types directly into textareas
   - Character counters update in real-time
   - Validation happens on input

5. **Save Journal**:
   - User clicks "Save Journal"
   - Client-side validation runs
   - If valid, data sent to `saveJournalEntry()`
   - Server-side validation runs
   - Entry saved to `journal_entries` table
   - If NEW entry (not edit):
     - `updateStreak()` called
     - Streak calculated and updated
     - Streak result returned
   - Success animation shown
   - Streak toast notification shown (if applicable)
   - Confetti shown (if milestone)
   - User redirected to home with updated streak

### **Streak Calculation Logic**

1. **When Journal Saved** (NEW entry only):
   - Get current streak from `streaks` table
   - Get `last_journal_created_at` timestamp
   - Compare with current time using `areConsecutiveDays()`:
     - **Same day**: No change (return same streak)
     - **Yesterday**: Increment by 1
     - **2+ days ago**: Reset to 1
     - **First journal**: Set to 1
   - Update `longest_streak` if `current_streak` exceeds it
   - Save to `streaks` table
   - Return streak result with metadata

2. **Timezone Handling**:
   - Uses local timezone for day boundaries
   - Example: 11:59 PM Monday + 12:01 AM Tuesday = consecutive ✅

3. **Rules**:
   - Streak increases ONLY on NEW journal creation
   - Edits don't affect streak
   - Deletions don't affect streak
   - Multiple journals same day don't increase streak
   - Streak resets if day skipped

### **AI Text Cleanup Flow**

1. **User Stops Voice Recording**:
   - Voice text transcribed
   - If `enableAICleanup` is true (default: true)

2. **API Request**:
   - Text sent to `/api/cleanup-text` endpoint
   - Server receives text

3. **Gemini API Processing**:
   - Server uses `GEMINI_API_KEY` from `.env.local`
   - Creates Gemini client with `gemini-1.5-flash` model
   - Sends text with detailed prompt for grammar/punctuation fixes
   - Gemini returns cleaned text

4. **Response**:
   - Server returns cleaned text
   - Client receives cleaned text
   - Textarea updated with cleaned text
   - Loading indicator hidden

5. **Error Handling**:
   - If API fails, falls back to basic grammar function
   - User-friendly error messages
   - User can still edit text manually

### **Notification Flow**

1. **User Enables Notifications** (Settings page):
   - User clicks "Request Permission"
   - Browser prompts for notification permission
   - If granted, preferences saved to `user_preferences` table

2. **User Sets Time**:
   - Selects hour and minute for daily reminder
   - Preferences saved to database

3. **Notification Scheduling**:
   - `useNotifications` hook loads preferences
   - If enabled and permission granted, `scheduleDailyNotification()` called
   - Calculates time until next notification
   - Sets timeout for first notification
   - Sets interval for daily notifications

4. **Notification Display**:
   - When time arrives, notification shown (if app not in focus)
   - Title: "📔 Time to Journal!"
   - Body: "Don't forget to write in your journal today. Keep your streak going! 🔥"
   - User can click notification to open app

### **Data Export Flow**

1. **User Clicks "Download My Data"** (Settings page):
   - `handleDownloadData()` called

2. **Data Collection**:
   - Fetches all journal entries from database
   - Fetches streak data
   - Combines into export object:
     ```json
     {
       "exportDate": "2024-01-01T00:00:00.000Z",
       "userEmail": "user@example.com",
       "journals": [...],
       "streak": {
         "currentStreak": 7,
         "longestStreak": 10,
         "lastJournalCreatedAt": "..."
       }
     }
     ```

3. **File Creation**:
   - Converts to JSON string
   - Creates Blob with JSON MIME type
   - Creates download URL

4. **Download**:
   - Creates temporary `<a>` element
   - Sets `href` to download URL
   - Sets `download` attribute with filename
   - Programmatically clicks link
   - Removes temporary element
   - Revokes download URL

5. **Success Feedback**:
   - Toast notification shown
   - "Data downloaded successfully"

### **Account Deletion Flow**

1. **User Clicks "Delete My Account"** (Settings page):
   - Confirmation dialog shown: "This cannot be undone"
   - User confirms

2. **Password Verification**:
   - Password input dialog shown
   - User enters password
   - Password verified via Supabase

3. **Data Deletion** (via `/api/delete-account`):
   - Uses `SUPABASE_SERVICE_ROLE_KEY` (admin access)
   - Deletes all journal entries for user
   - Deletes streak data for user
   - Deletes user preferences
   - Deletes user account (via Supabase Admin API)

4. **Logout & Redirect**:
   - User logged out
   - Session cleared
   - Redirected to login
   - Goodbye message shown

---

## 🏗️ Technical Architecture

### **Frontend Structure**

```
app/
├── page.js              # Home page
├── journal/
│   └── page.js          # Journal entry form
├── history/
│   └── page.js          # Journal history
├── settings/
│   └── page.js          # Settings page
├── login/
│   └── page.js          # Login page
├── register/
│   └── page.js          # Sign up page
├── privacy/
│   └── page.js          # Privacy Policy
├── terms/
│   └── page.js          # Terms of Service
├── api/
│   ├── cleanup-text/
│   │   └── route.js     # AI text cleanup API
│   └── delete-account/
│       └── route.js     # Account deletion API
├── components/
│   ├── VoiceTextarea.js     # Voice input component
│   ├── StreakToast.js       # Streak notification
│   ├── ConfettiAnimation.js # Confetti effect
│   ├── SuccessAnimation.js  # Success animation
│   └── AnimatedCounter.js   # Animated number counter
├── providers/
│   └── AuthProvider.js      # Authentication context
├── hooks/
│   └── useNotifications.js  # Notification hook
├── utils/
│   ├── storage.js           # Database operations
│   └── dateFormat.js        # Date formatting
└── layout.js            # Root layout

lib/
├── supabase-client.js   # Supabase client (browser)
├── supabase.js          # Supabase client (legacy)
├── streakUtils.js       # Streak calculation logic
├── validation.js        # Data validation
├── errorHandler.js      # Error handling
└── notifications.js     # Notification utilities

middleware.js            # Auth middleware
```

### **Data Flow**

1. **User Action** → Component
2. **Component** → Utility Function (e.g., `saveJournalEntry()`)
3. **Utility Function** → Supabase Client
4. **Supabase Client** → Supabase Database
5. **Response** → Component State Update
6. **State Update** → UI Re-render

### **API Routes**

- **`/api/cleanup-text`** (POST):
  - Receives text from client
  - Calls Google Gemini API
  - Returns cleaned text
  - Server-side only (API key secure)

- **`/api/delete-account`** (POST):
  - Receives userId and password
  - Verifies password
  - Deletes all user data (admin access)
  - Returns success/error
  - Server-side only (service role key secure)

### **State Management**

- **React Context**: Authentication state (`AuthProvider`)
- **React Hooks**: Local component state (`useState`, `useEffect`)
- **Custom Hooks**: Notification state (`useNotifications`)
- **URL Parameters**: Streak passing between pages
- **Database**: Source of truth for all data

---

## 🔒 Security Features

### **Authentication**
- ✅ Email/password authentication (Supabase)
- ✅ Email verification required
- ✅ Password hashing (handled by Supabase)
- ✅ Session management (secure cookies)
- ✅ Password minimum 8 characters

### **Database Security**
- ✅ Row-Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Policies enforce `auth.uid() = user_id`
- ✅ Foreign key constraints with CASCADE delete

### **API Security**
- ✅ API keys stored in `.env.local` (not in git)
- ✅ `.env.local` in `.gitignore`
- ✅ Server-side API routes (keys never exposed to browser)
- ✅ Service role key only used server-side
- ✅ Public key safe for client-side

### **Data Validation**
- ✅ Client-side validation (better UX)
- ✅ Server-side validation (security)
- ✅ Input sanitization
- ✅ SQL injection prevention (Supabase parameterized queries)
- ✅ XSS prevention (React escaping)

### **HTTPS**
- ✅ All connections encrypted (Supabase)
- ✅ Deployment should use HTTPS (Vercel does this automatically)

---

## ⚠️ Error Handling

### **Error Types Handled**

1. **Network Errors**:
   - Offline detection
   - Connection timeout
   - User-friendly messages
   - Retry buttons

2. **Database Errors**:
   - Connection failures
   - Table not found
   - Permission denied (RLS)
   - Not found (PGRST116)
   - User-friendly messages

3. **Authentication Errors**:
   - Invalid credentials
   - Session expired
   - User not authenticated
   - Automatic redirects

4. **Validation Errors**:
   - Invalid input
   - Missing required fields
   - Out of range values
   - Specific error messages

5. **API Errors**:
   - Gemini API failures
   - Fallback to basic grammar
   - User-friendly messages

6. **Browser API Errors**:
   - Microphone permission denied
   - Notification permission denied
   - Browser not supported
   - Fallback options

### **Error Handling Strategy**

- **User-Friendly Messages**: No technical jargon
- **Detailed Logging**: Technical details logged (development only)
- **Graceful Degradation**: App continues to work when possible
- **Retry Mechanisms**: Automatic retries for network errors
- **Fallback Options**: Alternative methods when features unavailable

---

## ✅ Data Validation

### **Validation Rules**

1. **Rating**:
   - Range: 1-10
   - Decimal allowed (1 decimal place)
   - Optional field

2. **Text Fields**:
   - Max length: 10,000 characters
   - Sanitized (control characters removed)
   - Optional fields

3. **Date**:
   - Valid date format
   - Range: 1900-2100
   - Required field

4. **General**:
   - At least one field must have content
   - Client-side validation (immediate feedback)
   - Server-side validation (security)

### **Validation Implementation**

- **Client-Side**: `lib/validation.js` functions
- **Server-Side**: Same functions called in API/storage
- **Sanitization**: Control characters removed, length limited
- **Error Messages**: Specific, user-friendly messages

---

## 📝 Summary

**Simply Journal** is a comprehensive voice-to-text journaling app with:

- ✅ **Secure Authentication** (Supabase)
- ✅ **Voice-to-Text Recording** (Web Speech API)
- ✅ **AI Text Cleanup** (Google Gemini)
- ✅ **Streak Tracking** (Motivation system)
- ✅ **Data Export** (JSON download)
- ✅ **Account Management** (Delete account)
- ✅ **Daily Reminders** (Notifications)
- ✅ **Legal Compliance** (Privacy Policy, Terms)
- ✅ **Error Handling** (Comprehensive)
- ✅ **Data Validation** (Client & server)
- ✅ **Beautiful UI** (Dark theme, animations)
- ✅ **Mobile-Friendly** (Responsive design)

**Tech Stack**: Next.js 16, React 19, Supabase, Google Gemini API, Framer Motion, Tailwind CSS

**Security**: Row-Level Security, HTTPS, Server-side API keys, Input validation

**External Services**: Supabase (database/auth), Google Gemini API (AI), Browser APIs (voice/notifications)


