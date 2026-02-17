import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'resumeBuilderData'

const emptyPersonal = { name: '', email: '', phone: '', location: '' }
const emptyEducation = { school: '', degree: '', dates: '', details: '' }
const emptyExperience = { company: '', role: '', dates: '', details: '' }
const emptyProject = { name: '', description: '', techStack: [] }
const emptySkillCategories = { technical: [], soft: [], tools: [] }
const emptyLinks = { github: '', linkedin: '' }

const initialResumeData = {
  personal: { ...emptyPersonal },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: { ...emptySkillCategories },
  links: { ...emptyLinks }
}

const sampleData = {
  personal: {
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  },
  summary: 'Software engineer with 5+ years building scalable web applications. Passionate about clean code and user-centered design.',
  education: [
    {
      school: 'Stanford University',
      degree: 'B.S. Computer Science',
      dates: '2015 – 2019',
      details: 'Focus in systems and machine learning.'
    }
  ],
  experience: [
    {
      company: 'Tech Corp',
      role: 'Senior Software Engineer',
      dates: '2021 – Present',
      details: 'Lead development of customer-facing platforms. Reduced load times by 40%.'
    },
    {
      company: 'Startup Inc',
      role: 'Software Engineer',
      dates: '2019 – 2021',
      details: 'Built MVP features and mentored interns.'
    }
  ],
  projects: [
    {
      name: 'Open Source Tool',
      description: 'Developer tool with 10k+ GitHub stars. Built with React and Node.',
      techStack: ['React', 'Node.js', 'TypeScript'],
      githubUrl: 'https://github.com/example/tool'
    }
  ],
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
    soft: ['Team Leadership', 'Problem Solving'],
    tools: ['Git', 'Docker']
  },
  links: {
    github: 'https://github.com/alexchen',
    linkedin: 'https://linkedin.com/in/alexchen'
  }
}

function migrateSkills(skills) {
  if (skills && typeof skills === 'object' && 'technical' in skills) {
    return {
      technical: Array.isArray(skills.technical) ? skills.technical : [],
      soft: Array.isArray(skills.soft) ? skills.soft : [],
      tools: Array.isArray(skills.tools) ? skills.tools : []
    }
  }
  if (Array.isArray(skills)) {
    return { ...emptySkillCategories, technical: skills }
  }
  return { ...emptySkillCategories }
}

function migrateProjects(projects) {
  if (!Array.isArray(projects)) return []
  return projects.map(p => ({
    name: String(p.name ?? ''),
    description: String(p.description ?? ''),
    techStack: Array.isArray(p.techStack) ? p.techStack : [],
    liveUrl: p.liveUrl ? String(p.liveUrl) : undefined,
    githubUrl: p.githubUrl ? String(p.githubUrl) : (p.link ? String(p.link) : undefined)
  }))
}

function mergeWithDefaults(stored) {
  return {
    personal: { ...emptyPersonal, ...stored.personal },
    summary: stored.summary ?? '',
    education: Array.isArray(stored.education) ? stored.education : [],
    experience: Array.isArray(stored.experience) ? stored.experience : [],
    projects: migrateProjects(stored.projects),
    skills: migrateSkills(stored.skills),
    links: { ...emptyLinks, ...stored.links }
  }
}

export function useResume() {
  const [data, setData] = useState(initialResumeData)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setData(mergeWithDefaults(parsed))
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {}
  }, [data])

  const updateData = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const loadSample = useCallback(() => {
    setData(JSON.parse(JSON.stringify(sampleData)))
  }, [])

  const reset = useCallback(() => {
    setData(JSON.parse(JSON.stringify(initialResumeData)))
  }, [])

  return {
    data,
    updateData,
    loadSample,
    reset
  }
}
