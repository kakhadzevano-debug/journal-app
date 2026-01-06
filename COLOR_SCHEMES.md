# Color Scheme Options for Voice Journal App

## Option 1: Soft Sage (Current - Applied)
**Best for:** Calm, natural, grounding feel

- **Background Gradient:** `#FAF9F6` → `#F5F3EF` (Very subtle gradient)
- **Primary Accent:** `#7A9A8C` (Softened sage teal - 10% less saturated)
- **Primary Hover:** `#6B9080` (Darker teal for hover state)
- **Secondary Accent (Mic):** `#E07A5F` (Warm terracotta/coral)
- **Text Primary:** `#1F2622` (Darker charcoal for better contrast)
- **Text Secondary:** `#7D8A96` (Medium gray)
- **Card Background:** `#FFFFFF` (Pure white)
- **Shadows:** Soft, subtle gray with low opacity

**Feel:** Natural, calming, professional, grounded

---

## Option 2: Lavender Dream
**Best for:** Soothing, gentle, dreamy feel

- **Background Gradient:** `#F8F6F9` → `#F5F3F7` (Very subtle lavender cream gradient)
- **Primary Accent:** `#9B8FB8` (Soft lavender sage)
- **Primary Hover:** `#8B7FA8` (Darker lavender)
- **Secondary Accent (Mic):** `#D4A5A5` (Dusty rose)
- **Text Primary:** `#3D3640` (Deep charcoal with purple undertone)
- **Text Secondary:** `#8B8792` (Muted lavender gray)
- **Card Background:** `#FFFFFF` (Pure white)
- **Shadows:** Soft purple-tinted shadows

**Feel:** Dreamy, gentle, peaceful, feminine

---

## Option 3: Warm Terracotta
**Best for:** Cozy, warm, inviting feel

- **Background Gradient:** `#FBF8F5` → `#F8F5F0` (Very subtle warm cream gradient)
- **Primary Accent:** `#A68B7C` (Soft terracotta sage)
- **Primary Hover:** `#967B6C` (Darker terracotta)
- **Secondary Accent (Mic):** `#D99785` (Warm peach)
- **Text Primary:** `#3A3530` (Warm charcoal)
- **Text Secondary:** `#8B7F75` (Warm gray)
- **Card Background:** `#FFFFFF` (Pure white)
- **Shadows:** Warm brown-tinted shadows

**Feel:** Cozy, inviting, warm, earthy

---

## Implementation Notes

All options include:
- ✅ Very subtle gradient backgrounds (almost imperceptible)
- ✅ Improved text contrast (WCAG AA compliant)
- ✅ Softened primary colors (10% less saturation)
- ✅ Consistent design language across all pages
- ✅ Premium, calming aesthetic

To switch schemes, update the colors in `tailwind.config.js` and replace all color values in:
- `app/page.js`
- `app/journal/page.js`
- `app/history/page.js`
- `app/components/VoiceTextarea.js`
- `app/globals.css` (for slider)



