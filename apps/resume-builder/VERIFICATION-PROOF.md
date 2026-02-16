# Proof + Submission System — Verification

## Shipped logic

**Status shows "Shipped" only when all three are true:**

1. **All 8 steps completed** — Each of Problem, Market, Architecture, HLD, LLD, Build, Test, Ship has an artifact (It Worked / Error / Add Screenshot).
2. **All 10 checklist tests passed** — Every checkbox on the Proof page is checked.
3. **All 3 proof links provided** — Lovable Project Link, GitHub Repository Link, and Deployed URL are valid URLs (http/https).

If any condition is missing, status stays **"In Progress"**.

---

## Proof validation

- **URL validation:** Each link must be a valid `http://` or `https://` URL.
- Invalid input shows an "Enter a valid URL" message and a red border.
- Links and checklist are stored in `localStorage` under `rb_final_submission`.
- Persistence: Refresh the page and confirm links and checklist state are still there.

---

## Copy Final Submission

- **Button:** "Copy Final Submission"
- **Copied text format:**

```
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: {link}
GitHub Repository: {link}
Live Deployment: {link}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
```

- Paste into a text editor after clicking to confirm format and links.

---

## Completion confirmation

- When all conditions are met, the status badge turns green **"Shipped"**.
- The message **"Project 3 Shipped Successfully."** appears in the main content (no confetti or flashy animations).

---

## Verification steps

1. **Shipped logic**
   - Go to `/rb/proof` with no steps done → status "In Progress".
   - Complete all 8 steps (mark artifact on each), fill 3 valid URLs, check all 10 checkboxes → status "Shipped", message "Project 3 Shipped Successfully."
   - Uncheck one checkbox → status returns to "In Progress", message hidden.
   - Clear one link → status "In Progress".

2. **Proof validation**
   - Enter `not-a-url` in Lovable link → "Enter a valid URL" and red border.
   - Enter `https://lovable.dev/project/123` → no error.
   - Same check for GitHub and Deploy URLs.

3. **Persistence**
   - Fill the 3 links and check some boxes → refresh → links and checkboxes still filled (from `rb_final_submission`).

4. **Copy Final Submission**
   - Click "Copy Final Submission" → paste elsewhere → confirm the block above with your three links and no extra content.

5. **Checklist lock**
   - Status never becomes "Shipped" if any of: 8 steps, 10 checkboxes, or 3 valid links is missing.
