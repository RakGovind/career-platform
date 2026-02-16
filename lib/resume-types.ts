export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  dates: string;
  details: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  dates: string;
  details: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  link?: string;
}

export interface SkillCategories {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface Links {
  github: string;
  linkedin: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategories;
  links: Links;
}

export const emptyPersonal: PersonalInfo = {
  name: "",
  email: "",
  phone: "",
  location: "",
};

export const emptyEducation: EducationEntry = {
  school: "",
  degree: "",
  dates: "",
  details: "",
};

export const emptyExperience: ExperienceEntry = {
  company: "",
  role: "",
  dates: "",
  details: "",
};

export const emptyProject: ProjectEntry = {
  name: "",
  description: "",
  techStack: [],
};

export const emptySkillCategories: SkillCategories = {
  technical: [],
  soft: [],
  tools: [],
};

export const emptyLinks: Links = {
  github: "",
  linkedin: "",
};

export const sampleData: ResumeData = {
  personal: {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  },
  summary:
    "Software engineer with 5+ years building scalable web applications. Passionate about clean code and user-centered design.",
  education: [
    {
      school: "Stanford University",
      degree: "B.S. Computer Science",
      dates: "2015 – 2019",
      details: "Focus in systems and machine learning.",
    },
  ],
  experience: [
    {
      company: "Tech Corp",
      role: "Senior Software Engineer",
      dates: "2021 – Present",
      details: "Lead development of customer-facing platforms. Reduced load times by 40%.",
    },
    {
      company: "Startup Inc",
      role: "Software Engineer",
      dates: "2019 – 2021",
      details: "Built MVP features and mentored interns.",
    },
  ],
  projects: [
    {
      name: "Open Source Tool",
      description: "Developer tool with 10k+ GitHub stars. Built with React and Node.",
      techStack: ["React", "Node.js", "TypeScript"],
      githubUrl: "https://github.com/example/tool",
    },
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL"],
    soft: ["Team Leadership", "Problem Solving"],
    tools: ["Git", "Docker"],
  },
  links: {
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen",
  },
};

export const initialResumeData: ResumeData = {
  personal: { ...emptyPersonal },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: { ...emptySkillCategories },
  links: { ...emptyLinks },
};
