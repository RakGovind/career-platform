// Skill categories and keywords for extraction
const skillCategories = {
  'Core CS': {
    keywords: ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented Programming', 'DBMS', 'Database', 'OS', 'Operating System', 'Networks', 'Computer Networks', 'CN']
  },
  'Languages': {
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Golang']
  },
  'Web': {
    keywords: ['React', 'Next.js', 'NextJS', 'Node.js', 'NodeJS', 'Express', 'REST', 'RESTful', 'GraphQL', 'Angular', 'Vue', 'HTML', 'CSS']
  },
  'Data': {
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'Cassandra', 'DynamoDB']
  },
  'Cloud/DevOps': {
    keywords: ['AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s', 'CI/CD', 'CI CD', 'Linux', 'Jenkins', 'GitHub Actions']
  },
  'Testing': {
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'pytest', 'Jest', 'Mocha', 'Testing', 'QA']
  }
}

/**
 * Extract skills from JD text
 * @param {string} jdText - Job description text
 * @returns {Object} - Extracted skills grouped by category
 */
export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return {
      categories: {},
      allSkills: [],
      hasSkills: false
    }
  }

  const normalizedText = jdText.toLowerCase()
  const extracted = {}
  const allSkills = []

  // Check each category
  Object.entries(skillCategories).forEach(([category, { keywords }]) => {
    const foundSkills = []
    
    keywords.forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase()
      // Check if keyword appears in text (case-insensitive)
      if (normalizedText.includes(normalizedKeyword)) {
        foundSkills.push(keyword)
        if (!allSkills.includes(keyword)) {
          allSkills.push(keyword)
        }
      }
    })

    if (foundSkills.length > 0) {
      extracted[category] = foundSkills
    }
  })

  // If no skills found, add default skills to "other" category
  const hasSkills = Object.keys(extracted).length > 0
  
  if (!hasSkills) {
    extracted['General'] = ['Communication', 'Problem solving', 'Basic coding', 'Projects']
    allSkills.push(...extracted['General'])
  }

  return {
    categories: extracted,
    allSkills,
    hasSkills
  }
}

/**
 * Get all skill categories
 */
export function getSkillCategories() {
  return skillCategories
}
