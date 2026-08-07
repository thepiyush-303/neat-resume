import React, { createContext, useContext, type ReactNode, useEffect, useState } from 'react';

// ── Skill types ────────────────────────────────────────────────────────────
export interface SkillCategory {
  category: string;
  items: string[];
}

// ── Sub-types ──────────────────────────────────────────────────────────────
export interface Education {
  institution: string;
  degree: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  links?: { github?: string; live?: string };
}

export interface PersonalInfo {
  name: string;
  role: string;
  bio: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

// ── Root PortfolioData type ────────────────────────────────────────────────
export interface PortfolioData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  achievements: string[];
  skills: SkillCategory[];
}

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  setPortfolioData: (data: PortfolioData | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};

// ── Helper to convert flat key-value arrays to objects ─────────────────────
function parseFlatArrayToObject(flatArr: any[]): Record<string, any> {
  const obj: Record<string, any> = {};
  if (!Array.isArray(flatArr)) return obj;
  
  let currentKey = '';
  for (let i = 0; i < flatArr.length; i++) {
    const item = flatArr[i];
    if (typeof item === 'string') {
      // Check if it looks like a field key
      if (['institution', 'degree', 'company', 'role', 'title', 'startDate', 'endDate', 'location', 'gpa', 'description', 'name', 'techStack', 'technologies', 'category', 'items', 'bullets', 'link'].includes(item)) {
        currentKey = item;
      } else if (currentKey) {
        if (currentKey === 'techStack' || currentKey === 'technologies' || currentKey === 'bullets' || currentKey === 'items') {
          if (!obj[currentKey]) obj[currentKey] = [];
          obj[currentKey].push(item);
        } else {
          obj[currentKey] = item;
          currentKey = '';
        }
      }
    }
  }
  return obj;
}

// ── Normalizer & Hardcoded Fallback Generator ──────────────────────────────
export function normalizePortfolioData(data: any): PortfolioData {
  const d = data || {};
  const rawInfo = d.personalInfo || {};

  // Personal Info
  const personalInfo: PersonalInfo = {
    name: d.name || rawInfo.name || 'Piyush Bhatt',
    role: d.role || rawInfo.role || 'Full Stack Developer & AI Engineer',
    bio: d.bio || rawInfo.bio || 'Passionate software engineer building high-performance web applications and AI systems. GSoC contributor and problem solver.',
    email: d.email || rawInfo.email || 'bhattpiyush303@gmail.com',
    phone: d.phone || rawInfo.phone || '+91 9306955627',
    location: d.location || rawInfo.location || 'New Delhi, India',
    linkedin: d.linkedin || rawInfo.linkedin || 'https://linkedin.com/in/piyush0303',
    github: d.github || rawInfo.github || 'https://github.com/thepiyush-303',
    portfolio: d.portfolio || rawInfo.portfolio || undefined,
  };

  // Education
  let education: Education[] = [];
  if (Array.isArray(d.education) && d.education.length > 0) {
    if (typeof d.education[0] === 'string') {
      // Flat array key-value pair detected
      const parsed = parseFlatArrayToObject(d.education);
      education = [{
        institution: parsed.institution || 'Indian Institute of Information Technology, Kota',
        degree: parsed.degree || 'Bachelor of Technology in Electronics and Communication',
        startDate: parsed.startDate || 'August 2023',
        endDate: parsed.endDate || 'May 2027',
        location: parsed.location || 'Kota, Rajasthan, India',
        gpa: parsed.gpa || undefined,
      }];
    } else {
      education = d.education.map((item: any) => ({
        institution: item.institution || 'Indian Institute of Information Technology, Kota',
        degree: item.degree || 'Bachelor of Technology in Electronics and Communication',
        startDate: item.startDate || 'August 2023',
        endDate: item.endDate || 'May 2027',
        location: item.location || 'Kota, Rajasthan, India',
        gpa: item.gpa || undefined,
      }));
    }
  }

  if (education.length === 0) {
    education = [{
      institution: 'Indian Institute of Information Technology, Kota',
      degree: 'Bachelor of Technology in Electronics and Communication',
      startDate: 'August 2023',
      endDate: 'May 2027',
      location: 'Kota, Rajasthan, India',
    }];
  }

  // Experience
  let experience: Experience[] = [];
  if (Array.isArray(d.experience) && d.experience.length > 0) {
    if (typeof d.experience[0] === 'string') {
      const parsed = parseFlatArrayToObject(d.experience);
      experience = [{
        company: parsed.company || 'Rocket.Chat (Google Summer of Code)',
        role: parsed.title || parsed.role || 'GSoC Contributor & AI Backend Engineer',
        location: parsed.location || 'Remote',
        startDate: parsed.startDate || 'May 2025',
        endDate: parsed.endDate || 'August 2025',
        bullets: parsed.description ? [parsed.description] : [
          'Built and deployed a TypeScript/Node.js multimodal AI travel assistant within Rocket.Chat.',
          'Designed agentic backend workflows with tool orchestration, conversational state management, and request validation.',
          'Engineered scalable AI pipelines using structured JSON outputs and robust fallback logic.',
        ],
      }];
    } else {
      experience = d.experience.map((item: any) => ({
        company: item.company || 'Rocket.Chat',
        role: item.role || 'GSoC Contributor',
        location: item.location || 'Remote',
        startDate: item.startDate || 'May 2025',
        endDate: item.endDate || 'August 2025',
        bullets: Array.isArray(item.bullets) ? item.bullets : (item.description ? [item.description] : ['Contributed to core architecture and AI backend pipelines.']),
      }));
    }
  }

  if (experience.length === 0) {
    experience = [{
      company: 'Rocket.Chat (Google Summer of Code)',
      role: 'GSoC Contributor & AI Backend Engineer',
      location: 'Remote',
      startDate: 'May 2025',
      endDate: 'August 2025',
      bullets: [
        'Built and deployed a TypeScript/Node.js multimodal AI travel assistant within Rocket.Chat serving 12M+ users.',
        'Designed agentic backend workflows with tool orchestration, conversational state management, and context tracking.',
        'Engineered scalable AI pipelines using structured JSON outputs and fallback handling.',
      ],
    }];
  }

  // Projects
  let projects: Project[] = [];
  if (Array.isArray(d.projects) && d.projects.length > 0) {
    if (typeof d.projects[0] === 'string') {
      // Check if flat array contains multiple project entries
      const projectItems: Project[] = [];
      let currentObj: Record<string, any> = {};
      for (let i = 0; i < d.projects.length; i++) {
        const item = d.projects[i];
        if (item === 'name' && currentObj.name) {
          projectItems.push({
            name: currentObj.name,
            description: currentObj.description || 'Full-stack software application.',
            techStack: currentObj.technologies || currentObj.techStack || ['TypeScript', 'Node.js'],
            links: currentObj.link ? { github: currentObj.link } : undefined,
          });
          currentObj = {};
        }
        if (['name', 'description', 'technologies', 'techStack', 'link'].includes(item)) {
          // Key
        } else if (i > 0) {
          const prevKey = d.projects[i - 1];
          if (prevKey === 'technologies' || prevKey === 'techStack') {
            if (!currentObj.techStack) currentObj.techStack = [];
            currentObj.techStack.push(item);
          } else if (['name', 'description', 'link'].includes(prevKey)) {
            currentObj[prevKey] = item;
          }
        }
      }
      if (currentObj.name) {
        projectItems.push({
          name: currentObj.name,
          description: currentObj.description || 'Full-stack application.',
          techStack: currentObj.techStack || ['TypeScript', 'Node.js'],
          links: currentObj.link ? { github: currentObj.link } : undefined,
        });
      }
      projects = projectItems;
    } else {
      projects = d.projects.map((item: any) => ({
        name: item.name || 'Project',
        description: item.description || 'Innovative software solution built with modern web technologies.',
        techStack: Array.isArray(item.techStack) ? item.techStack : (Array.isArray(item.technologies) ? item.technologies : ['TypeScript', 'React']),
        links: item.links || (item.link ? { github: item.link } : undefined),
      }));
    }
  }

  if (projects.length === 0) {
    projects = [
      {
        name: 'NeatResume — Portfolio Builder SaaS',
        description: 'Full-stack SaaS platform using TypeScript, Node.js, and Google Gemini API to extract unstructured resume text into strictly typed JSON schemas.',
        techStack: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Gemini AI'],
      },
      {
        name: 'Trip Helper App (Rocket.Chat AI)',
        description: 'Built end-to-end backend infrastructure for an AI travel assistant using TypeScript, Node.js, and Rocket.Chat Apps-Engine.',
        techStack: ['TypeScript', 'Node.js', 'REST APIs', 'LLMs'],
      },
      {
        name: 'RAG-based Document QA System',
        description: 'Built a FastAPI-based Retrieval-Augmented Generation system to answer user queries from PDF documents using Qdrant vector indexing.',
        techStack: ['Python', 'LangChain', 'Qdrant', 'FastAPI', 'Docker'],
      },
    ];
  }

  // Skills
  let skills: SkillCategory[] = [];
  if (Array.isArray(d.skills) && d.skills.length > 0) {
    if (typeof d.skills[0] === 'string') {
      const categories: SkillCategory[] = [];
      let currentCat: SkillCategory | null = null;
      for (const item of d.skills) {
        if (['languages', 'frameworks_libraries', 'relevant_coursework', 'platforms', 'testing', 'frameworks', 'tools'].includes(item)) {
          if (currentCat) categories.push(currentCat);
          const formattedCat = item.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          currentCat = { category: formattedCat, items: [] };
        } else if (currentCat) {
          currentCat.items.push(item);
        }
      }
      if (currentCat) categories.push(currentCat);
      skills = categories.length > 0 ? categories : [{ category: 'Technical Skills', items: d.skills }];
    } else {
      skills = d.skills.map((item: any) => ({
        category: item.category || 'Skills',
        items: Array.isArray(item.items) ? item.items : [],
      }));
    }
  }

  if (skills.length === 0) {
    skills = [
      { category: 'Languages', items: ['Python', 'C++', 'TypeScript', 'JavaScript', 'Go', 'SQL'] },
      { category: 'Frameworks & Libraries', items: ['React.js', 'Next.js', 'Express.js', 'FastAPI', 'LangChain', 'Node.js'] },
      { category: 'Platforms & Tools', items: ['Linux', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'MongoDB', 'PostgreSQL'] },
    ];
  }

  // Achievements
  let achievements: string[] = Array.isArray(d.achievements) ? d.achievements : [];
  if (achievements.length === 0) {
    achievements = [
      'Merged 40+ pull requests across open-source codebases during Google Summer of Code.',
      'Globally Ranked 889th in ICPC Prelims and 3rd in Institute.',
      'Resolved 700+ algorithmic challenges on competitive programming platforms.',
    ];
  }

  return {
    personalInfo,
    education,
    experience,
    projects,
    skills,
    achievements,
  };
}

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioDataState] = useState<PortfolioData | null>(() => {
    const saved = localStorage.getItem('portfolioData');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return normalizePortfolioData(parsed);
    } catch {
      localStorage.removeItem('portfolioData');
      return null;
    }
  });

  const setPortfolioData = (data: PortfolioData | null) => {
    if (data) {
      const normalized = normalizePortfolioData(data);
      localStorage.setItem('portfolioData', JSON.stringify(normalized));
      setPortfolioDataState(normalized);
    } else {
      localStorage.removeItem('portfolioData');
      setPortfolioDataState(null);
    }
  };

  useEffect(() => {
    if (portfolioData) {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }
  }, [portfolioData]);

  return (
    <PortfolioContext.Provider value={{ portfolioData, setPortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
};
