import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import {
  Layout,
  Grid3x3,
  Terminal,
  Palette,
  Building2,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  Share2,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Code2,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
} from 'lucide-react';

type TemplateId = 'standard' | 'minimalist' | 'bento' | 'creative' | 'corporate';

const LAYOUTS: { id: TemplateId; name: string; tag: string }[] = [
  { id: 'standard', name: 'Standard', tag: 'Popular' },
  { id: 'minimalist', name: 'Minimalist', tag: 'Clean' },
  { id: 'bento', name: 'Bento Grid', tag: 'Modern' },
  { id: 'creative', name: 'Creative', tag: 'Dark' },
  { id: 'corporate', name: 'Corporate', tag: 'Pro' },
];

export const TemplateSelection: React.FC = () => {
  const { portfolioData: rawData } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('standard');
  const [activeTab, setActiveTab] = useState<'appearance' | 'content'>('appearance');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [published, setPublished] = useState(false);

  // Default fallback data if rawData is null
  const d = rawData || {
    personalInfo: {
      name: 'Piyush Bhatt',
      role: 'Full Stack Developer & AI Engineer',
      bio: 'Aspiring Computer Science professional skilled in TypeScript, Node.js, AI backend systems, and web frameworks. GSoC contributor building scalable applications.',
      email: 'bhattpiyush303@gmail.com',
      phone: '+91 9306955627',
      location: 'New Delhi, India',
      linkedin: 'https://linkedin.com/in/piyush0303',
      github: 'https://github.com/thepiyush-303',
    },
    education: [
      {
        institution: 'Indian Institute of Information Technology, Kota',
        degree: 'Bachelor of Technology in Electronics and Communication',
        startDate: 'August 2023',
        endDate: 'May 2027',
        location: 'Kota, Rajasthan, India',
      },
    ],
    experience: [
      {
        company: 'Rocket.Chat (Google Summer of Code)',
        role: 'GSoC Contributor & AI Backend Engineer',
        location: 'Remote',
        startDate: 'May 2025',
        endDate: 'August 2025',
        bullets: [
          'Built and deployed a TypeScript/Node.js multimodal AI travel assistant within Rocket.Chat serving 12M+ users.',
          'Designed agentic backend workflows with tool orchestration, conversational state management, and request validation.',
          'Engineered scalable AI pipelines using structured JSON outputs and fallback handling.',
        ],
      },
    ],
    projects: [
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
    ],
    skills: [
      { category: 'Languages', items: ['Python', 'C++', 'TypeScript', 'JavaScript', 'Go', 'SQL'] },
      { category: 'Frameworks & Libraries', items: ['React.js', 'Next.js', 'Express.js', 'FastAPI', 'LangChain', 'Node.js'] },
      { category: 'Platforms & Tools', items: ['Linux', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'MongoDB', 'PostgreSQL'] },
    ],
    achievements: [
      'Merged 40+ pull requests across open-source codebases during Google Summer of Code.',
      'Globally Ranked 889th in ICPC Prelims and 3rd in Institute.',
      'Resolved 700+ algorithmic challenges on competitive programming platforms.',
    ],
  };

  const p = d.personalInfo;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900 font-sans">
      
      {/* ── Left Sidebar (Layout & Content Customizer) ── */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-sm">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 font-black text-xl text-indigo-600 hover:opacity-90">
              <span>artfolio</span>
              <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">↗</div>
            </button>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
        </div>

        {/* Tab Switcher (Appearance / Content) */}
        <div className="p-3 bg-gray-50 border-b border-gray-200/80 flex gap-1">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'appearance'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'content'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Content
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === 'appearance' ? (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900">Layout</h3>
                <p className="text-xs text-gray-500">Customize the layout of your portfolio</p>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {LAYOUTS.map((tmpl) => {
                  const isSelected = activeTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setActiveTemplate(tmpl.id)}
                      className={`group relative flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-full h-24 rounded-lg bg-gray-100 mb-2 border border-gray-200 flex flex-col p-2 overflow-hidden group-hover:scale-[1.02] transition-transform">
                        {/* Mini mockup wireframe */}
                        <div className="w-8 h-8 rounded-full bg-indigo-200 mb-1" />
                        <div className="w-16 h-2 bg-gray-300 rounded mb-1" />
                        <div className="w-20 h-1.5 bg-gray-200 rounded mb-2" />
                        <div className="w-full h-8 bg-white rounded border border-gray-200" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-gray-800'}`}>
                        {tmpl.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Portfolio Data</h3>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2 text-gray-600">
                <div><strong className="text-gray-900">Name:</strong> {p.name}</div>
                <div><strong className="text-gray-900">Role:</strong> {p.role}</div>
                <div><strong className="text-gray-900">Education:</strong> {d.education.length} entries</div>
                <div><strong className="text-gray-900">Experience:</strong> {d.experience.length} roles</div>
                <div><strong className="text-gray-900">Projects:</strong> {d.projects.length} items</div>
              </div>
            </div>
          )}
        </div>

      </aside>

      {/* ── Center Live Preview Area ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0 z-10">
          
          {/* Live Preview URL bar */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono text-gray-600 border border-gray-200">
              <span>🔒 https://www.artfolio.tech/</span>
              <span className="text-indigo-600 font-semibold">{p.name.toLowerCase().replace(/\s+/g, '')}</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> All changes saved
            </span>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setPublished(true);
                setTimeout(() => setPublished(false), 3000);
              }}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" /> {published ? 'Published!' : 'Publish'}
            </button>
          </div>

        </header>

        {/* ── Main Portfolio Canvas ── */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-100/70 custom-scrollbar">
          
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[850px]">
            
            {/* Portfolio Grid Layout (2-Column Desktop layout matching reference image) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[850px]">
              
              {/* ── Left Sidebar Profile Column ── */}
              <div className="lg:col-span-5 border-r border-gray-100 p-8 md:p-10 flex flex-col justify-between bg-gray-50/40">
                <div>
                  
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 shadow-lg mb-6 overflow-hidden">
                    <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-4xl font-extrabold text-indigo-600">
                      {p.name.charAt(0)}
                    </div>
                  </div>

                  {/* Name & Title */}
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                    {p.name}
                  </h1>
                  <p className="text-sm font-semibold text-gray-600 mb-6 leading-relaxed">
                    {p.role} {d.education[0]?.institution ? `Student at ${d.education[0].institution}` : ''}
                  </p>

                  {/* Bio */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-8">
                    {p.bio}
                  </p>

                  {/* Section Navigation Tabs */}
                  <nav className="space-y-1 border-t border-b border-gray-200/80 py-4 mb-8">
                    {[
                      { id: 'about', label: 'About', icon: Sparkles },
                      { id: 'skills', label: 'Skills', icon: Code2 },
                      { id: 'education', label: 'Education', icon: GraduationCap },
                      { id: 'experience', label: 'Experience', icon: Briefcase },
                      { id: 'projects', label: 'Projects', icon: FolderGit2 },
                      { id: 'achievements', label: 'Achievements', icon: Award },
                    ].map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          activeSection === sec.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <sec.icon className="w-3.5 h-3.5" /> {sec.label}
                      </button>
                    ))}
                  </nav>

                </div>

                {/* Bottom Contact Pill & Buttons */}
                <div className="space-y-4 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {p.email && (
                      <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                        <Globe className="w-3.5 h-3.5" /> GitHub
                      </a>
                    )}
                    {p.linkedin && (
                      <a href={p.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                        <Globe className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-2xl text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                      <FileText className="w-4 h-4" /> Download Resume
                    </button>
                    {p.phone && (
                      <button className="p-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors" title={p.phone}>
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* ── Right Content Column ── */}
              <div className="lg:col-span-7 p-8 md:p-10 space-y-10 overflow-y-auto">
                
                {/* ── Education Section ── */}
                {(activeSection === 'all' || activeSection === 'education') && d.education.length > 0 && (
                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-600" /> Education
                    </h2>
                    <div className="space-y-6">
                      {d.education.map((edu, i) => (
                        <div key={i} className="group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-bold text-base text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {edu.degree} @ <span className="underline decoration-indigo-300">{edu.institution}</span>
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">{edu.location}</p>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                              {edu.startDate} – {edu.endDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Professional Experience Section ── */}
                {(activeSection === 'all' || activeSection === 'experience') && d.experience.length > 0 && (
                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" /> Professional Experience
                    </h2>
                    <div className="space-y-6">
                      {d.experience.map((exp, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-bold text-base text-gray-900">
                                {exp.role} @ <span className="text-indigo-600">{exp.company}</span>
                              </h3>
                              <p className="text-xs text-gray-500">{exp.location}</p>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full w-fit">
                              {exp.startDate} – {exp.endDate}
                            </span>
                          </div>
                          
                          {/* Bullets */}
                          <ul className="space-y-2 mb-4">
                            {exp.bullets.map((bullet, j) => (
                              <li key={j} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Projects Section ── */}
                {(activeSection === 'all' || activeSection === 'projects') && d.projects.length > 0 && (
                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-indigo-600" /> Projects
                    </h2>
                    <div className="space-y-6">
                      {d.projects.map((proj, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <h3 className="font-bold text-base text-gray-900">{proj.name}</h3>
                            {proj.links?.github && (
                              <a href={proj.links.github} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                                GitHub <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-4">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {proj.techStack.map((tech, j) => (
                              <span key={j} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Skills Section ── */}
                {(activeSection === 'all' || activeSection === 'skills') && d.skills.length > 0 && (
                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-indigo-600" /> Skills
                    </h2>
                    <div className="space-y-4">
                      {d.skills.map((skillGroup, i) => (
                        <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{skillGroup.category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {skillGroup.items.map((skill, j) => (
                              <span key={j} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Achievements Section ── */}
                {(activeSection === 'all' || activeSection === 'achievements') && d.achievements.length > 0 && (
                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" /> Achievements
                    </h2>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <ul className="space-y-3">
                        {d.achievements.map((ach, i) => (
                          <li key={i} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 flex-shrink-0 shadow-sm" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default TemplateSelection;
