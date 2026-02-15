import { extractSkills } from './skillExtraction'
import { DEFAULT_SKILLS } from './schema'

/**
 * Generate round-wise preparation checklist
 */
function generateChecklist(extractedSkills) {
  const categories = extractedSkills.categories || {}
  const hasDSA = categories['Core CS']?.some(skill => 
    ['DSA', 'Data Structures', 'Algorithms'].some(dsa => skill.includes(dsa))
  ) || false
  const hasWeb = Object.keys(categories).includes('Web')
  const hasData = Object.keys(categories).includes('Data')
  const hasCloud = Object.keys(categories).includes('Cloud/DevOps')
  const hasLanguages = Object.keys(categories).includes('Languages')

  const checklist = {
    'Round 1: Aptitude / Basics': [
      'Review basic mathematics (percentages, ratios, profit & loss)',
      'Practice logical reasoning questions',
      'Prepare for verbal ability tests',
      'Review quantitative aptitude basics',
      'Practice time management for tests',
      'Review general knowledge if required',
      'Prepare for online assessment platforms',
      'Practice mock aptitude tests'
    ],
    'Round 2: DSA + Core CS': [
      hasDSA ? 'Revise core data structures (Arrays, Linked Lists, Trees)' : 'Learn basic data structures',
      hasDSA ? 'Practice algorithm problems (Sorting, Searching, Dynamic Programming)' : 'Start with basic algorithms',
      'Review time and space complexity analysis',
      categories['Core CS']?.includes('OOP') ? 'Revise OOP concepts (Encapsulation, Inheritance, Polymorphism)' : 'Learn OOP fundamentals',
      categories['Core CS']?.includes('DBMS') ? 'Review database concepts and SQL queries' : 'Learn basic database concepts',
      categories['Core CS']?.includes('OS') ? 'Review operating system concepts (Processes, Threads, Memory)' : 'Learn OS basics',
      categories['Core CS']?.includes('Networks') ? 'Review networking fundamentals' : 'Learn basic networking',
      'Practice coding problems on platforms (LeetCode, HackerRank)'
    ],
    'Round 3: Tech Interview (Projects + Stack)': [
      hasWeb ? 'Prepare to explain React/Next.js projects in detail' : 'Prepare project explanations',
      hasLanguages ? `Review ${categories['Languages']?.[0] || 'programming language'} fundamentals` : 'Review programming language basics',
      hasData ? 'Prepare database design questions and query optimization' : 'Review database concepts',
      hasCloud ? 'Prepare cloud architecture and deployment questions' : 'Review deployment basics',
      'Prepare STAR method for project discussions',
      'Review system design basics (if applicable)',
      'Prepare to explain technical decisions in projects',
      'Review version control (Git) and collaboration workflows'
    ],
    'Round 4: Managerial / HR': [
      'Prepare answers for "Tell me about yourself"',
      'Prepare questions to ask the interviewer',
      'Review company background and values',
      'Prepare examples of teamwork and leadership',
      'Review your resume thoroughly',
      'Prepare for salary negotiation (if applicable)',
      'Practice behavioral questions (STAR method)',
      'Prepare for "Why this company?" question'
    ]
  }

  return checklist
}

/**
 * Generate 7-day preparation plan
 */
function generatePlan(extractedSkills) {
  const categories = extractedSkills.categories || {}
  const hasReact = categories['Web']?.some(skill => skill.toLowerCase().includes('react')) || false
  const hasDSA = categories['Core CS']?.some(skill => 
    ['DSA', 'Data Structures', 'Algorithms'].some(dsa => skill.includes(dsa))
  ) || false
  const hasWeb = Object.keys(categories).includes('Web')
  const hasData = Object.keys(categories).includes('Data')
  const hasLanguages = Object.keys(categories).includes('Languages')

  const plan = [
    {
      day: 'Day 1-2',
      title: 'Basics + Core CS',
      tasks: [
        'Review fundamental CS concepts',
        categories['Core CS']?.includes('OOP') ? 'Deep dive into OOP principles' : 'Learn OOP basics',
        categories['Core CS']?.includes('DBMS') ? 'Review database normalization and ACID properties' : 'Learn database fundamentals',
        categories['Core CS']?.includes('OS') ? 'Review process scheduling and memory management' : 'Learn OS basics',
        'Practice basic coding problems',
        'Set up development environment'
      ]
    },
    {
      day: 'Day 3-4',
      title: 'DSA + Coding Practice',
      tasks: [
        hasDSA ? 'Solve 10-15 medium DSA problems' : 'Start with basic array and string problems',
        'Focus on time complexity optimization',
        'Practice problem-solving patterns (Two pointers, Sliding window, etc.)',
        'Review common algorithm patterns',
        'Practice on coding platforms',
        'Solve problems related to detected skills'
      ]
    },
    {
      day: 'Day 5',
      title: 'Project + Resume Alignment',
      tasks: [
        'Review all projects mentioned in resume',
        hasReact ? 'Prepare React project explanations and architecture' : 'Prepare project explanations',
        hasWeb ? 'Review web development concepts and best practices' : 'Review project technical details',
        'Align resume points with job requirements',
        'Prepare project demos and code walkthroughs',
        'Update resume if needed to match JD keywords'
      ]
    },
    {
      day: 'Day 6',
      title: 'Mock Interview Questions',
      tasks: [
        'Practice common interview questions for your stack',
        hasData ? 'Prepare SQL query optimization examples' : 'Review database interview questions',
        hasWeb ? 'Prepare frontend/backend architecture questions' : 'Prepare technical questions',
        'Practice explaining code and design decisions',
        'Do mock interviews with peers or mentors',
        'Review behavioral questions'
      ]
    },
    {
      day: 'Day 7',
      title: 'Revision + Weak Areas',
      tasks: [
        'Revise all key concepts',
        'Focus on identified weak areas',
        'Review common mistakes from practice',
        'Prepare final questions for interviewer',
        'Review company-specific information',
        'Get adequate rest before interview'
      ]
    }
  ]

  return plan
}

/**
 * Generate likely interview questions based on skills
 */
function generateQuestions(extractedSkills) {
  const categories = extractedSkills.categories || {}
  const questions = []
  
  // DSA questions
  if (categories['Core CS']?.some(skill => ['DSA', 'Data Structures', 'Algorithms'].some(dsa => skill.includes(dsa)))) {
    questions.push('How would you optimize search in sorted data? Explain time complexity.')
    questions.push('Explain the difference between BFS and DFS. When would you use each?')
    questions.push('How does dynamic programming differ from greedy algorithms?')
  }

  // SQL/Database questions
  if (categories['Data']?.some(skill => skill.toLowerCase().includes('sql'))) {
    questions.push('Explain indexing and when it helps improve query performance.')
    questions.push('What is the difference between INNER JOIN and LEFT JOIN?')
    questions.push('How would you optimize a slow-running SQL query?')
  }

  // React questions
  if (categories['Web']?.some(skill => skill.toLowerCase().includes('react'))) {
    questions.push('Explain state management options in React. When would you use Redux vs Context API?')
    questions.push('What is the difference between useEffect and useMemo? Provide examples.')
    questions.push('How does React handle component re-renders? Explain the reconciliation process.')
  }

  // Node.js questions
  if (categories['Web']?.some(skill => skill.toLowerCase().includes('node'))) {
    questions.push('Explain the event loop in Node.js. How does it handle asynchronous operations?')
    questions.push('What is the difference between process.nextTick and setImmediate?')
  }

  // OOP questions
  if (categories['Core CS']?.some(skill => skill.toLowerCase().includes('oop'))) {
    questions.push('Explain the four pillars of OOP with real-world examples.')
    questions.push('What is the difference between abstraction and encapsulation?')
  }

  // Cloud questions
  if (categories['Cloud/DevOps']) {
    questions.push('Explain the difference between horizontal and vertical scaling.')
    questions.push('How would you deploy a web application on AWS? Walk through the architecture.')
  }

  // Language-specific questions
  if (categories['Languages']?.some(skill => skill.toLowerCase().includes('java'))) {
    questions.push('Explain the difference between ArrayList and LinkedList in Java.')
  }
  if (categories['Languages']?.some(skill => skill.toLowerCase().includes('python'))) {
    questions.push('Explain the difference between lists and tuples in Python. When would you use each?')
  }
  if (categories['Languages']?.some(skill => skill.toLowerCase().includes('javascript'))) {
    questions.push('Explain closures in JavaScript with an example.')
    questions.push('What is the difference between var, let, and const?')
  }

  // Fill remaining slots with general questions
  const generalQuestions = [
    'Tell me about a challenging project you worked on. What was your approach?',
    'How do you stay updated with the latest technologies?',
    'Explain a time when you had to learn a new technology quickly.',
    'What is your approach to debugging complex issues?',
    'How do you ensure code quality in your projects?',
    'Explain the difference between REST and GraphQL APIs.',
    'What is your experience with version control systems?',
    'How do you handle conflicts in a team project?'
  ]

  while (questions.length < 10) {
    const randomQuestion = generalQuestions[Math.floor(Math.random() * generalQuestions.length)]
    if (!questions.includes(randomQuestion)) {
      questions.push(randomQuestion)
    }
  }

  return questions.slice(0, 10)
}

/**
 * Perform complete analysis
 */
export function performAnalysis(jdText, company = '', role = '') {
  const extractedSkills = extractSkills(jdText)
  
  // If no skills detected, default skills are already added in extractSkills
  // But ensure we have the right structure
  if (!extractedSkills.hasSkills && extractedSkills.categories['General']) {
    // Replace 'General fresher stack' with default skills if needed
    const generalSkills = extractedSkills.categories['General']
    if (generalSkills.length === 1 && generalSkills[0] === 'General fresher stack') {
      extractedSkills.categories['General'] = DEFAULT_SKILLS.other
      extractedSkills.allSkills = [...DEFAULT_SKILLS.other]
    }
  }

  const checklist = generateChecklist(extractedSkills)
  const plan = generatePlan(extractedSkills)
  const questions = generateQuestions(extractedSkills)

  return {
    extractedSkills,
    checklist,
    plan,
    questions
  }
}
