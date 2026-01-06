# Streak UI Implementation Guide

## Overview
This document explains how the streak tracking UI is implemented and how to test it.

## Components Created

### 1. `StreakToast.js`
- Toast notification component for streak feedback
- Shows at top of screen for 3 seconds
- Different types: success, milestone, record, reset, same_day
- Auto-dismisses with smooth animations

### 2. `ConfettiAnimation.js`
- Celebration animation for milestones and records
- 50 colorful particles falling from top
- Runs for 2 seconds
- Triggered on milestones (7, 30, 100, 365 days) and new records

## Updated Components

### 1. Home Page (`app/page.js`)
**Enhanced Streak Display:**
- Shows current streak with animated counter
- Displays longest streak below current
- Fire emoji animates (floating effect)
- Glow effect when streak >= 7 days
- Shows "Start your streak today!" when streak is 0
- Pulse animation when streak updates
- Loading state while fetching

**Features:**
- Fetches full streak data (current + longest) on load
- Handles URL parameters for streak updates
- Smooth animations and transitions

### 2. Journal Page (`app/journal/page.js`)
**Streak Feedback Integration:**
- After saving NEW journal, shows appropriate feedback:
  - **Milestone (7, 30, 100, 365 days)**: Confetti + special message
  - **New Record**: Confetti + "New personal record!" message
  - **Streak Increased**: "🔥 X days streak! Keep it going!"
  - **Same Day**: "Already journaled today! Current streak: X days"
  - **Streak Reset**: "Streak reset. Starting fresh at 1 day! 💪"

**Important:** 
- Only shows feedback for NEW entries (not edits)
- Edits and deletes don't trigger streak updates

### 3. Storage Utils (`app/utils/storage.js`)
**Updated `saveJournalEntry()`:**
- Returns object: `{ id, streakResult, isNewEntry }`
- Automatically calls `updateStreak()` for new entries
- Returns streak result for UI feedback

## Utility Functions

### `lib/streakUtils.js`

**`updateStreak()`** - Returns:
```javascript
{
  current_streak: number,
  longest_streak: number,
  previous_streak: number,
  day_relationship: 'same_day' | 'consecutive' | 'broken' | 'first_journal',
  is_new_record: boolean,
  streak_increased: boolean,
  streak_reset: boolean
}
```

**`getMilestone(streak)`** - Checks for milestones:
- 7 days: "One week strong! 💪"
- 30 days: "One month streak! Amazing! 🎉"
- 100 days: "100 days! You're incredible! 🏆"
- 365 days: "One year! Legendary! 🌟"

**`getStreakData()`** - Returns current streak data:
```javascript
{
  current_streak: number,
  longest_streak: number,
  last_journal_created_at: string | null
}
```

## CSS Animations

Added to `app/globals.css`:
- `@keyframes fire-float` - Floating fire emoji animation
- `@keyframes streak-pulse` - Pulse effect for streak updates
- `@keyframes streak-glow` - Glow effect for high streaks (7+ days)

## Testing Checklist

### ✅ Basic Functionality
- [ ] Streak displays on home page (0 for new users)
- [ ] Streak updates when new journal is saved
- [ ] Streak doesn't change when editing existing journal
- [ ] Streak doesn't change when deleting journal
- [ ] Longest streak tracked correctly

### ✅ Visual Feedback
- [ ] Toast appears after saving new journal
- [ ] Confetti shows for milestones (7, 30, 100 days)
- [ ] Confetti shows for new personal records
- [ ] Fire emoji animates on home page
- [ ] Streak number animates when updating
- [ ] Loading state shows while fetching

### ✅ Messages
- [ ] Correct message for streak increase
- [ ] Correct message for same day journal
- [ ] Correct message for streak reset
- [ ] Milestone messages show at 7, 30, 100 days
- [ ] "Start your streak today!" shows for 0 days

### ✅ Edge Cases
- [ ] Multiple journals in one day (shouldn't increase streak)
- [ ] Journaling after 24+ hour gap (streak resets)
- [ ] First journal ever (streak = 1)
- [ ] Editing journal doesn't affect streak
- [ ] Deleting journal doesn't affect streak

## How to Test

1. **New User (0 streak):**
   - Create first journal → Should show "🔥 1 day streak!"
   - Home page should show "1 day" with "Start your streak today!" message

2. **Consecutive Days:**
   - Journal on Day 1 → Streak = 1
   - Journal on Day 2 → Streak = 2, toast: "🔥 2 days streak!"
   - Journal on Day 3 → Streak = 3, toast: "🔥 3 days streak!"

3. **Same Day:**
   - Journal in morning → Streak = 1
   - Journal again in evening → Toast: "Already journaled today! Current streak: 1 day"
   - Streak should remain 1

4. **Streak Reset:**
   - Journal on Day 1 → Streak = 1
   - Skip Day 2
   - Journal on Day 3 → Toast: "Streak reset. Starting fresh at 1 day! 💪"
   - Streak should be 1

5. **Milestones:**
   - Reach 7 days → Confetti + "One week strong! 💪"
   - Reach 30 days → Confetti + "One month streak! Amazing! 🎉"
   - Reach 100 days → Confetti + "100 days! You're incredible! 🏆"

6. **New Record:**
   - Previous longest: 5 days
   - Reach 6 days → Confetti + "🎉 New personal record! 6 days!"

7. **Editing:**
   - Create journal → Streak = 1
   - Edit that journal → No toast, streak stays 1
   - Create new journal → Streak = 2

## Database Setup

Make sure you've run the SQL from `supabase_streak_setup.sql`:
- Creates `streaks` table
- Adds `created_at` to `journal_entries` table
- Sets up Row Level Security policies

## Troubleshooting

**Streak not updating:**
- Check browser console for errors
- Verify SQL setup was run
- Check that `updateStreak()` is being called for new entries only

**Toast not showing:**
- Check that `StreakToast` component is imported
- Verify `streakToast.show` state is being set
- Check browser console for errors

**Confetti not showing:**
- Verify milestone detection is working
- Check that `showConfetti` state is being set
- Ensure `ConfettiAnimation` component is imported

## Notes

- Streak is based on `created_at` timestamp, NOT the journal `date` field
- Multiple journals in one day don't increase streak
- Edits preserve original `created_at`, so they don't affect streak
- Deletes don't affect streak (by design)


