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

// Validate that stored data is not corrupt (e.g. Gemini sometimes returns nulls)
function validatePortfolioData(data: any): data is PortfolioData {
  if (!data || typeof data !== 'object') return false;
  if (!data.personalInfo || typeof data.personalInfo !== 'object') return false;
  if (!data.personalInfo.name || typeof data.personalInfo.name !== 'string') return false;
  if (!Array.isArray(data.experience)) return false;
  if (!Array.isArray(data.education)) return false;
  if (!Array.isArray(data.projects)) return false;
  if (!Array.isArray(data.skills)) return false;
  return true;
}

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(() => {
    const saved = localStorage.getItem('portfolioData');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (!validatePortfolioData(parsed)) {
        // Corrupt data — clear it
        localStorage.removeItem('portfolioData');
        return null;
      }
      return parsed as PortfolioData;
    } catch {
      localStorage.removeItem('portfolioData');
      return null;
    }
  });

  useEffect(() => {
    if (portfolioData) {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    } else {
      localStorage.removeItem('portfolioData');
    }
  }, [portfolioData]);

  return (
    <PortfolioContext.Provider value={{ portfolioData, setPortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
};
