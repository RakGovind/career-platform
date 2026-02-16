/**
 * Company Intel Service
 * Heuristic-based company information extraction
 */

// Known enterprise companies
const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook',
  'infosys', 'tcs', 'wipro', 'tech mahindra', 'hcl', 'cognizant',
  'accenture', 'ibm', 'oracle', 'sap', 'salesforce', 'adobe',
  'netflix', 'uber', 'airbnb', 'linkedin', 'twitter', 'paypal',
  'visa', 'mastercard', 'goldman sachs', 'morgan stanley', 'jpmorgan',
  'bank of america', 'wells fargo', 'citibank', 'citi'
]

// Known mid-size companies (examples)
const MIDSIZE_COMPANIES = [
  'zomato', 'swiggy', 'razorpay', 'razorpay', 'razorpay',
  'flipkart', 'myntra', 'ola', 'byjus', 'unacademy'
]

/**
 * Detect company size category
 */
export function detectCompanySize(companyName) {
  if (!companyName || typeof companyName !== 'string') {
    return 'startup'
  }

  const normalized = companyName.toLowerCase().trim()

  // Check if enterprise
  if (ENTERPRISE_COMPANIES.some(ec => normalized.includes(ec))) {
    return 'enterprise'
  }

  // Check if mid-size
  if (MIDSIZE_COMPANIES.some(mc => normalized.includes(mc))) {
    return 'midsize'
  }

  // Default to startup
  return 'startup'
}

/**
 * Infer industry from company name or JD keywords
 */
export function inferIndustry(companyName = '', jdText = '') {
  const text = (companyName + ' ' + jdText).toLowerCase()

  // Banking/Finance
  if (text.match(/\b(bank|finance|financial|payment|fintech|banking|credit|loan|investment)\b/)) {
    return 'Financial Services'
  }

  // E-commerce
  if (text.match(/\b(ecommerce|e-commerce|retail|shopping|marketplace|delivery|food delivery)\b/)) {
    return 'E-commerce & Retail'
  }

  // Healthcare
  if (text.match(/\b(healthcare|health|medical|hospital|pharma|pharmaceutical)\b/)) {
    return 'Healthcare'
  }

  // Education
  if (text.match(/\b(education|edtech|learning|university|school|course)\b/)) {
    return 'Education Technology'
  }

  // Gaming
  if (text.match(/\b(gaming|game|gamer|entertainment|streaming)\b/)) {
    return 'Gaming & Entertainment'
  }

  // SaaS/Cloud
  if (text.match(/\b(saas|cloud|software as a service|platform)\b/)) {
    return 'SaaS & Cloud Services'
  }

  // Default
  return 'Technology Services'
}

/**
 * Get typical hiring focus based on company size
 */
export function getHiringFocus(size) {
  const focusMap = {
    enterprise: {
      title: 'Structured DSA + Core Fundamentals',
      points: [
        'Strong emphasis on data structures and algorithms',
        'System design and scalability concepts',
        'Core computer science fundamentals (OS, DBMS, Networks)',
        'Problem-solving approach and optimization',
        'Code quality and best practices',
        'Large-scale system experience preferred'
      ]
    },
    midsize: {
      title: 'Balanced Technical + Practical Skills',
      points: [
        'Solid DSA foundation with practical application',
        'Hands-on experience with relevant tech stack',
        'Ability to work independently and in teams',
        'Problem-solving with real-world constraints',
        'Good communication and collaboration skills',
        'Fast learning and adaptability'
      ]
    },
    startup: {
      title: 'Practical Problem Solving + Stack Depth',
      points: [
        'Strong practical coding skills',
        'Deep knowledge of specific tech stack',
        'Ability to build and ship features quickly',
        'Full-stack or specialized expertise',
        'Startup mindset and ownership',
        'Flexibility to wear multiple hats'
      ]
    }
  }

  return focusMap[size] || focusMap.startup
}

/**
 * Generate complete company intel
 */
export function generateCompanyIntel(companyName, jdText = '') {
  if (!companyName || !companyName.trim()) {
    return null
  }

  const size = detectCompanySize(companyName)
  const industry = inferIndustry(companyName, jdText)
  const hiringFocus = getHiringFocus(size)

  return {
    companyName: companyName.trim(),
    industry,
    size,
    sizeLabel: size === 'enterprise' ? 'Enterprise (2000+)' : 
                size === 'midsize' ? 'Mid-size (200-2000)' : 
                'Startup (<200)',
    hiringFocus
  }
}
