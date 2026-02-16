# AI Resume Builder — Test Checklist

## ATS Scoring & Features

Run through each item to verify the resume builder works correctly.

---

### 1. All form sections save to localStorage
- [ ] Fill Personal Info (name, email, phone, location)
- [ ] Add Summary
- [ ] Add Education entry
- [ ] Add Experience entry with bullets
- [ ] Add Project with tech stack
- [ ] Add skills to Technical, Soft, and Tools
- [ ] Add GitHub and LinkedIn links
- [ ] Refresh the page — all data persists

### 2. Live preview updates in real-time
- [ ] On `/builder`, type in any field
- [ ] Right panel updates immediately
- [ ] Add/remove entries — preview reflects changes

### 3. Template switching preserves data
- [ ] On `/builder` or `/preview`, select Classic, Modern, Minimal
- [ ] Resume content stays the same
- [ ] Layout/typography changes only

### 4. Color theme persists after refresh
- [ ] Pick Teal, Navy, Burgundy, Forest, or Charcoal
- [ ] Refresh page — color remains selected

### 5. ATS score calculates correctly
- [ ] Start with empty form → score 0
- [ ] Add name (+10) → score 10
- [ ] Add email (+10) → score 20
- [ ] Add summary >50 chars (+10) → score 30
- [ ] Add 1 experience with bullets (+15) → score 45
- [ ] Add 1 education (+10) → score 55
- [ ] Add 5+ skills (+10) → score 65
- [ ] Add 1 project (+10) → score 75
- [ ] Add phone (+5) → score 80
- [ ] Add LinkedIn (+5) → score 85
- [ ] Add GitHub (+5) → score 90
- [ ] Add action verbs to summary (+10) → score 100

### 6. Score updates live on edit
- [ ] Edit any field on `/builder`
- [ ] ATS score updates without refresh
- [ ] Same on `/preview` when navigating there

### 7. Export buttons work
- [ ] **Download PDF** — opens print dialog and shows toast "PDF export ready! Check your downloads."
- [ ] **Copy Resume as Text** — copies plain text; paste into Notepad to verify

### 8. Empty states handled gracefully
- [ ] Empty form shows "Resume content will appear here"
- [ ] Empty sections are not shown in preview
- [ ] No errors when all fields are blank

### 9. Mobile responsive layout works
- [ ] Resize browser or use device toolbar
- [ ] Builder form and preview stack or scroll
- [ ] Template picker and color circles wrap
- [ ] No horizontal overflow

### 10. No console errors on any page
- [ ] Open DevTools Console (F12)
- [ ] Visit `/`, `/builder`, `/preview`, `/proof`
- [ ] Visit `/rb/01-problem` through `/rb/proof`
- [ ] No red errors in console

---

## Score Bands (on /preview)

- **0–40:** Red "Needs Work"
- **41–70:** Amber "Getting There"  
- **71–100:** Green "Strong Resume"
