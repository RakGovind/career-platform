# Company Intel + Round Mapping Verification Guide

## ✅ Implementation Confirmation

### 1. Company Intel Block ✅
**Location**: `src/utils/companyIntel.js` and `src/pages/Results.jsx`

- **Company Name**: Displayed from input
- **Industry**: Inferred from company name/JD keywords or defaults to "Technology Services"
- **Size Category**: 
  - Enterprise (2000+) - for known large companies
  - Mid-size (200-2000) - for known mid-size companies
  - Startup (<200) - default for unknown companies
- **Typical Hiring Focus**: Template text based on size
  - Enterprise: Structured DSA + Core Fundamentals
  - Mid-size: Balanced Technical + Practical Skills
  - Startup: Practical Problem Solving + Stack Depth
- **Demo Mode Note**: Shows "Demo Mode: Company intel generated heuristically."

### 2. Round Mapping Engine ✅
**Location**: `src/utils/roundMapping.js` and `src/pages/Results.jsx`

- **Dynamic Generation**: Based on company size + detected skills
- **Enterprise Rounds**: 4 rounds (Online Test, Technical, Deep Dive, HR)
- **Mid-size Rounds**: 3 rounds (Technical Screening, Technical Interview, Culture Fit)
- **Startup Rounds**: 3 rounds (Practical Coding, System Discussion, Culture Fit)
- **Why This Round Matters**: Short explanation under each round
- **Visual**: Vertical timeline with dots and connecting line

### 3. Persistence ✅
- Company intel stored in `companyIntel` field
- Round mapping stored in `roundMapping` field
- Both persist in localStorage history entries
- Backward compatible: generates intel for old entries on load

## 🧪 Testing Scenarios

### Test Scenario 1: Enterprise Company (Amazon)

**Input**:
- Company: "Amazon"
- JD: "Looking for Software Engineer with DSA, OOP, DBMS knowledge. Experience with AWS, Docker required."

**Expected Results**:

**Company Intel**:
- Company: Amazon
- Industry: Technology Services (or E-commerce if JD mentions it)
- Size: Enterprise (2000+)
- Hiring Focus: Structured DSA + Core Fundamentals

**Round Mapping**:
1. Round 1: Online Test - DSA + Aptitude + Core CS Fundamentals
2. Round 2: Technical Interview - DSA Problem Solving + Core CS Concepts
3. Round 3: Technical Deep Dive - System Design + Projects Discussion + Tech Stack
4. Round 4: HR / Managerial Round - Culture Fit + Behavioral Questions

**Verification Steps**:
1. Enter company name "Amazon" and JD
2. Analyze
3. Check Company Intel block appears
4. Verify size shows "Enterprise (2000+)"
5. Check Round Mapping shows 4 rounds
6. Verify round descriptions match detected skills (DSA, AWS, Docker)

### Test Scenario 2: Startup Company (Unknown)

**Input**:
- Company: "TechStartup Inc"
- JD: "Looking for React developer with Node.js experience. Must know JavaScript, TypeScript."

**Expected Results**:

**Company Intel**:
- Company: TechStartup Inc
- Industry: Technology Services (default)
- Size: Startup (<200) - default for unknown
- Hiring Focus: Practical Problem Solving + Stack Depth

**Round Mapping**:
1. Round 1: Practical Coding - Live Coding + Tech Stack Assessment
2. Round 2: System Discussion - Architecture Discussion + Tech Decisions
3. Round 3: Culture Fit - Team Fit + Startup Mindset + Offer Discussion

**Verification Steps**:
1. Enter company name "TechStartup Inc" and JD
2. Analyze
3. Check Company Intel block appears
4. Verify size shows "Startup (<200)"
5. Check Round Mapping shows 3 rounds
6. Verify rounds focus on practical skills

### Test Scenario 3: Mid-size Company (Zomato)

**Input**:
- Company: "Zomato"
- JD: "Looking for Backend Engineer with Python, Django, PostgreSQL experience."

**Expected Results**:

**Company Intel**:
- Company: Zomato
- Industry: E-commerce & Retail (detected from company name)
- Size: Mid-size (200-2000)
- Hiring Focus: Balanced Technical + Practical Skills

**Round Mapping**:
1. Round 1: Technical Screening - Practical Coding + Technical Discussion
2. Round 2: Technical Interview - Problem Solving + Technical Concepts
3. Round 3: Culture Fit / Final Round - Team Fit + Behavioral Questions

**Verification Steps**:
1. Enter company name "Zomato" and JD
2. Analyze
3. Check Company Intel block appears
4. Verify size shows "Mid-size (200-2000)"
5. Check Round Mapping shows 3 rounds
6. Verify industry shows "E-commerce & Retail"

### Test Scenario 4: No Company Name

**Input**:
- Company: (empty)
- JD: "Looking for Software Engineer with React, Node.js"

**Expected Results**:
- Company Intel block does NOT appear
- Round Mapping does NOT appear
- Other sections (Skills, Checklist, Plan) still work

**Verification Steps**:
1. Leave company name empty
2. Enter JD
3. Analyze
4. Verify Company Intel block is not shown
5. Verify Round Mapping is not shown

### Test Scenario 5: Industry Inference

**Test Cases**:

1. **Banking**: Company: "BankCorp", JD: "financial services"
   - Expected: Industry = "Financial Services"

2. **Healthcare**: Company: "HealthTech", JD: "healthcare platform"
   - Expected: Industry = "Healthcare"

3. **Education**: Company: "EduApp", JD: "education technology"
   - Expected: Industry = "Education Technology"

4. **Gaming**: Company: "GameStudio", JD: "gaming platform"
   - Expected: Industry = "Gaming & Entertainment"

5. **Default**: Company: "TechCorp", JD: "software development"
   - Expected: Industry = "Technology Services"

### Test Scenario 6: Persistence

**Steps**:
1. Analyze JD with company name
2. Verify Company Intel and Round Mapping appear
3. Refresh page
4. **Expected**: Company Intel and Round Mapping persist
5. Navigate to History
6. Click on entry
7. **Expected**: Company Intel and Round Mapping still visible

### Test Scenario 7: Backward Compatibility

**Steps**:
1. Create an old entry (manually in localStorage or from before this feature)
2. Load it in Results page
3. **Expected**: Company Intel and Round Mapping generated on-the-fly if company name exists
4. Verify intel is saved back to entry

## 📋 Sample Test JDs

### Enterprise JD
```
Company: Microsoft
Role: Software Engineer

Job Description:
We are looking for a Software Engineer with strong DSA and OOP skills. 
Experience with C#, .NET, Azure cloud services required. 
Knowledge of SQL Server, system design, and distributed systems preferred.
Must have experience with large-scale applications.
```

**Expected**:
- Size: Enterprise
- Rounds: 4 rounds with DSA focus
- Industry: Technology Services

### Startup JD
```
Company: MyStartup
Role: Full Stack Developer

Job Description:
Looking for a full-stack developer with React and Node.js experience. 
Must know JavaScript, TypeScript, MongoDB. 
Ability to build features quickly and work independently required.
```

**Expected**:
- Size: Startup
- Rounds: 3 rounds with practical focus
- Industry: Technology Services

### Mid-size JD
```
Company: Razorpay
Role: Backend Engineer

Job Description:
Seeking Backend Engineer with Python, Django, PostgreSQL experience. 
Knowledge of payment systems, REST APIs, and microservices architecture preferred.
```

**Expected**:
- Size: Mid-size
- Rounds: 3 rounds with balanced focus
- Industry: Financial Services (if detected) or Technology Services

## ✅ Verification Checklist

- [x] Company Intel block renders when company name provided
- [x] Industry inference works from keywords
- [x] Size detection works (Enterprise/Mid-size/Startup)
- [x] Hiring Focus adapts to company size
- [x] Demo mode note appears
- [x] Round Mapping generates based on size + skills
- [x] Round descriptions adapt to detected skills
- [x] "Why this round matters" appears under each round
- [x] Timeline visual renders correctly
- [x] Intel persists in history entries
- [x] Backward compatibility works (generates for old entries)
- [x] No intel shown when company name missing
- [x] Premium design maintained

## 🚀 Quick Verification

1. Run `npm run dev`
2. Navigate to `/dashboard/analyze`
3. Enter company: "Amazon" and a JD with DSA keywords
4. Analyze
5. Verify Company Intel block appears with Enterprise size
6. Verify Round Mapping shows 4 rounds
7. Check "Why this round matters" under each round
8. Refresh page → verify persistence
9. Check History → verify intel persists

All features should work smoothly with premium design maintained!
