/**
 * Round Mapping Engine
 * Generates dynamic round structure based on company size and detected skills
 */

import { extractSkills } from './skillExtraction'

/**
 * Generate round mapping based on company size and skills
 */
export function generateRoundMapping(companySize, extractedSkills) {
  const hasDSA = extractedSkills.categories['Core CS']?.some(skill => 
    ['DSA', 'Data Structures', 'Algorithms'].some(dsa => skill.includes(dsa))
  ) || false
  
  const hasWeb = Object.keys(extractedSkills.categories).includes('Web')
  const hasData = Object.keys(extractedSkills.categories).includes('Data')
  const hasCloud = Object.keys(extractedSkills.categories).includes('Cloud/DevOps')
  const hasLanguages = Object.keys(extractedSkills.categories).includes('Languages')

  if (companySize === 'enterprise') {
    return generateEnterpriseRounds(hasDSA, hasWeb, hasData, hasCloud)
  } else if (companySize === 'midsize') {
    return generateMidsizeRounds(hasDSA, hasWeb, hasData)
  } else {
    return generateStartupRounds(hasWeb, hasData, hasCloud)
  }
}

/**
 * Enterprise round structure
 */
function generateEnterpriseRounds(hasDSA, hasWeb, hasData, hasCloud) {
  const rounds = []

  // Round 1: Online Test
  rounds.push({
    round: 1,
    title: 'Online Test',
    description: hasDSA 
      ? 'DSA + Aptitude + Core CS Fundamentals'
      : 'Aptitude + Technical MCQ + Core CS',
    whyMatters: 'This round filters candidates based on fundamental knowledge and problem-solving ability. Strong performance here is crucial to advance.',
    duration: '90-120 minutes'
  })

  // Round 2: Technical Interview
  rounds.push({
    round: 2,
    title: 'Technical Interview',
    description: hasDSA
      ? 'DSA Problem Solving + Core CS Concepts'
      : 'Technical Discussion + Problem Solving',
    whyMatters: 'Tests your ability to think through problems, write clean code, and explain your approach. Expect algorithmic challenges.',
    duration: '45-60 minutes'
  })

  // Round 3: Technical Deep Dive
  rounds.push({
    round: 3,
    title: 'Technical Deep Dive',
    description: hasWeb || hasData || hasCloud
      ? 'System Design + Projects Discussion + Tech Stack'
      : 'Projects Discussion + Technical Deep Dive',
    whyMatters: 'Evaluates your real-world experience, system design thinking, and ability to work on complex systems.',
    duration: '60-90 minutes'
  })

  // Round 4: HR/Managerial
  rounds.push({
    round: 4,
    title: 'HR / Managerial Round',
    description: 'Culture Fit + Behavioral Questions + Offer Discussion',
    whyMatters: 'Assesses alignment with company values, communication skills, and long-term fit. Often includes salary negotiation.',
    duration: '30-45 minutes'
  })

  return rounds
}

/**
 * Mid-size round structure
 */
function generateMidsizeRounds(hasDSA, hasWeb, hasData) {
  const rounds = []

  // Round 1: Technical Screening
  rounds.push({
    round: 1,
    title: 'Technical Screening',
    description: hasDSA
      ? 'Coding Challenge + DSA Discussion'
      : 'Practical Coding + Technical Discussion',
    whyMatters: 'Quick assessment of coding skills and technical knowledge. Often includes live coding or take-home assignment.',
    duration: '45-60 minutes'
  })

  // Round 2: Technical Interview
  rounds.push({
    round: 2,
    title: 'Technical Interview',
    description: hasWeb
      ? 'System Discussion + Tech Stack Deep Dive'
      : 'Problem Solving + Technical Concepts',
    whyMatters: 'Evaluates your technical depth and ability to solve real problems. Expect questions about your experience and projects.',
    duration: '60 minutes'
  })

  // Round 3: Culture Fit / Final
  rounds.push({
    round: 3,
    title: 'Culture Fit / Final Round',
    description: 'Team Fit + Behavioral Questions + Offer Discussion',
    whyMatters: 'Ensures you align with team culture and company values. May include meeting with potential team members.',
    duration: '30-45 minutes'
  })

  return rounds
}

/**
 * Startup round structure
 */
function generateStartupRounds(hasWeb, hasData, hasCloud) {
  const rounds = []

  // Round 1: Practical Coding
  rounds.push({
    round: 1,
    title: 'Practical Coding',
    description: hasWeb
      ? 'Live Coding + Tech Stack Assessment'
      : 'Coding Challenge + Problem Solving',
    whyMatters: 'Startups value practical skills. This round tests your ability to write working code quickly and solve real problems.',
    duration: '60-90 minutes'
  })

  // Round 2: System Discussion
  rounds.push({
    round: 2,
    title: 'System Discussion',
    description: hasWeb || hasData || hasCloud
      ? 'Architecture Discussion + Tech Decisions'
      : 'Technical Discussion + Project Review',
    whyMatters: 'Assesses your ability to design systems, make technical decisions, and work independently. Expect deep technical questions.',
    duration: '45-60 minutes'
  })

  // Round 3: Culture Fit
  rounds.push({
    round: 3,
    title: 'Culture Fit',
    description: 'Team Fit + Startup Mindset + Offer Discussion',
    whyMatters: 'Startups look for ownership, adaptability, and alignment with fast-paced environment. Be ready to discuss your startup mindset.',
    duration: '30 minutes'
  })

  return rounds
}
