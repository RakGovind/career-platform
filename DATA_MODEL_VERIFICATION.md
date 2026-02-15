# Data Model & Validation Verification Guide

## ✅ Implementation Confirmation

### 1. Input Validation ✅
**Location**: `src/pages/Analyze.jsx`

- **JD Textarea**: Required field (HTML5 `required` attribute)
- **JD Length Warning**: Shows calm warning if JD < 200 characters
  - Message: "This JD is too short to analyze deeply. Paste full JD for better output."
  - Visual: Amber border and background
- **Company & Role**: Remain optional
- **Button**: Disabled if JD is empty

### 2. Standardized Analysis Entry Schema ✅
**Location**: `src/utils/schema.js`

**Required Fields**:
- `id`: string
- `createdAt`: ISO string
- `updatedAt`: ISO string
- `company`: string | ""
- `role`: string | ""
- `jdText`: string
- `extractedSkills`: {
  - `coreCS`: string[]
  - `languages`: string[]
  - `web`: string[]
  - `data`: string[]
  - `cloud`: string[]
  - `testing`: string[]
  - `other`: string[]
}
- `roundMapping`: [{ roundTitle, focusAreas[], whyItMatters }]
- `checklist`: [{ roundTitle, items[] }]
- `plan7Days`: [{ day, focus, tasks[] }]
- `questions`: string[]
- `baseScore`: number (0-100)
- `skillConfidenceMap`: { [skill]: "know" | "practice" }
- `finalScore`: number (0-100)

### 3. Default Skills When None Detected ✅
**Location**: `src/utils/skillExtraction.js` and `src/utils/schema.js`

- If no skills detected, populates `other` category with:
  - "Communication"
  - "Problem solving"
  - "Basic coding"
  - "Projects"
- Plan/checklist/questions adjust accordingly

### 4. Score Stability Rules ✅
**Location**: `src/utils/storageService.js` and `src/pages/Results.jsx`

- **baseScore**: Computed only on analyze, never changes
- **finalScore**: Changes only based on skillConfidenceMap
- When user toggles skills:
  - Updates `finalScore` + `updatedAt`
  - Persists to history entry
  - `baseScore` remains unchanged

### 5. History Robustness ✅
**Location**: `src/utils/storageService.js`

- Validates entries before loading
- Skips corrupted entries
- Shows error message: "One saved entry couldn't be loaded. Create a new analysis."
- Auto-cleans corrupted data
- Handles JSON parse errors gracefully

## 🧪 Testing Scenarios

### Test 1: Input Validation

**Scenario**: Short JD (< 200 chars)
1. Navigate to `/dashboard/analyze`
2. Enter JD: "Looking for software engineer"
3. **Expected**: 
   - Warning appears: "This JD is too short to analyze deeply..."
   - Textarea has amber border/background
   - Can still analyze (warning only)

**Scenario**: Empty JD
1. Leave JD empty
2. **Expected**: 
   - Button disabled
   - Cannot submit

**Scenario**: Valid JD (> 200 chars)
1. Enter JD with > 200 characters
2. **Expected**: 
   - No warning
   - Normal styling
   - Can analyze

### Test 2: Schema Consistency

**Steps**:
1. Analyze a JD
2. Check localStorage
3. **Expected**: Entry has all required fields
4. Verify field types match schema
5. **Expected**: All fields present, correct types

**Verify Fields**:
- `id`: string ✓
- `createdAt`: ISO string ✓
- `updatedAt`: ISO string ✓
- `company`: string ✓
- `role`: string ✓
- `jdText`: string ✓
- `extractedSkills`: object with arrays ✓
- `baseScore`: number (0-100) ✓
- `finalScore`: number (0-100) ✓

### Test 3: Default Skills

**Scenario**: No skills detected
1. Enter JD: "Looking for a software engineer"
2. Analyze
3. **Expected**:
   - `extractedSkills.other` contains: ["Communication", "Problem solving", "Basic coding", "Projects"]
   - Plan/checklist/questions adapt to general skills

### Test 4: Score Stability

**Steps**:
1. Analyze JD → Note `baseScore` (e.g., 65)
2. Toggle skills → Watch `finalScore` change
3. Refresh page
4. **Expected**:
   - `baseScore` unchanged (65)
   - `finalScore` reflects skill toggles
5. Toggle more skills
6. **Expected**: `baseScore` still unchanged, `finalScore` updates

**Verify**:
- `baseScore` never changes after initial analysis
- `finalScore` updates with skill toggles
- Both persist correctly

### Test 5: History Robustness

**Scenario**: Corrupted Entry
1. Manually corrupt localStorage:
   ```javascript
   localStorage.setItem('placement_readiness_history', '[{"id":"123","invalid":"data"}]')
   ```
2. Navigate to `/dashboard/history`
3. **Expected**:
   - Corrupted entry skipped
   - Valid entries still shown
   - No errors in console (or handled gracefully)

**Scenario**: Invalid JSON
1. Manually corrupt localStorage:
   ```javascript
   localStorage.setItem('placement_readiness_history', 'invalid json{')
   ```
2. Navigate to `/dashboard/history`
3. **Expected**:
   - History cleared/reset
   - No crashes
   - Can create new analysis

**Scenario**: Missing Required Fields
1. Create entry missing `jdText`:
   ```javascript
   localStorage.setItem('placement_readiness_history', '[{"id":"123","createdAt":"2024-01-01"}]')
   ```
2. Navigate to `/dashboard/history`
3. **Expected**:
   - Entry skipped/validated
   - Error handled gracefully

### Test 6: Backward Compatibility

**Steps**:
1. Load old entry format (if exists)
2. **Expected**:
   - Normalized to new schema
   - All fields populated
   - Works correctly

## 📋 Edge Cases

### Edge Case 1: JD Exactly 200 Characters
- **Expected**: No warning (200+ is valid)

### Edge Case 2: JD with Only Whitespace
- **Expected**: Treated as empty, button disabled

### Edge Case 3: Score Bounds
- **Expected**: `baseScore` and `finalScore` always 0-100

### Edge Case 4: Empty Skill Arrays
- **Expected**: Arrays exist but empty, not undefined

### Edge Case 5: Missing Optional Fields
- **Expected**: Defaults applied (empty strings, empty arrays)

## ✅ Verification Checklist

- [x] JD validation works (< 200 chars warning)
- [x] JD required validation works
- [x] Schema consistent across all entries
- [x] All required fields present
- [x] Default skills populate when none detected
- [x] baseScore never changes after analysis
- [x] finalScore updates with skill toggles
- [x] Corrupted entries handled gracefully
- [x] Invalid JSON handled gracefully
- [x] Missing fields handled gracefully
- [x] Backward compatibility maintained
- [x] Score bounds enforced (0-100)
- [x] Premium design maintained

## 🚀 Quick Verification

1. Run `npm run dev`
2. Navigate to `/dashboard/analyze`
3. Test JD validation (short, empty, valid)
4. Analyze a JD
5. Check localStorage → verify schema
6. Toggle skills → verify score stability
7. Refresh → verify persistence
8. Corrupt localStorage → verify robustness

All features should work smoothly with strict data validation!
