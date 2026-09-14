import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPortfolioData } from '../lib/mockData';
import { ArrowLeft } from 'lucide-react';

// Import actual template components
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { BentoGridTemplate } from '../components/templates/BentoGridTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { CorporateTemplate } from '../components/templates/CorporateTemplate';

type TemplateId = 'standard' | 'minimalist' | 'bento' | 'creative' | 'corporate';

const LAYOUTS: { id: TemplateId; name: string; tag: string }[] = [
  { id: 'standard', name: 'Standard', tag: 'Popular' },
  { id: 'minimalist', name: 'Minimalist', tag: 'Clean' },
  { id: 'bento', name: 'Bento Grid', tag: 'Modern' },
  { id: 'creative', name: 'Creative', tag: 'Dark' },
  { id: 'corporate', name: 'Corporate', tag: 'Pro' },
];

/* ── Inline Standard Template ─────────────────────────────────────────── */
const StandardTemplate: React.FC = () => {
  const d = mockPortfolioData as any;
  const p = d.personalInfo;
  const education = (d.education ?? []).filter(Boolean);
  const experience = (d.experience ?? []).filter(Boolean);
  const projects = (d.projects ?? []).filter(Boolean);
  const skills = (d.skills ?? []).filter(Boolean);
  const achievements = (d.achievements ?? []).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '64px 48px 48px', textAlign: 'center' }}>
        {/* Avatar */}
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}>
          {p.name?.charAt(0) || 'U'}
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: '#111', margin: '0 0 8px 0', letterSpacing: -2, lineHeight: 1.1 }}>{p.name}</h1>
        <p style={{ fontSize: 18, color: '#6b7280', margin: 0, fontWeight: 500 }}>
          {p.role}{education[0]?.institution ? ` · ${education[0].institution}` : ''}
        </p>
        <p style={{ fontSize: 15, color: '#9ca3af', marginTop: 12, maxWidth: 700, margin: '12px auto 0', lineHeight: 1.7 }}>{p.bio}</p>
        {/* Contact Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          {p.email && <a href={`mailto:${p.email}`} style={{ fontSize: 13, padding: '8px 16px', borderRadius: 10, background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontWeight: 500 }}>✉ {p.email}</a>}
          {p.phone && <span style={{ fontSize: 13, padding: '8px 16px', borderRadius: 10, background: '#f3f4f6', color: '#374151' }}>📞 {p.phone}</span>}
          {p.location && <span style={{ fontSize: 13, padding: '8px 16px', borderRadius: 10, background: '#f3f4f6', color: '#374151' }}>📍 {p.location}</span>}
          {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: '8px 16px', borderRadius: 10, background: '#f3f4f6', color: '#374151', textDecoration: 'none' }}>GitHub ↗</a>}
          {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: '8px 16px', borderRadius: 10, background: '#f3f4f6', color: '#374151', textDecoration: 'none' }}>LinkedIn ↗</a>}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
        {/* About */}
        {p.bio && (
          <section style={{ marginBottom: 48, padding: 32, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 16 }}>About</h2>
            <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>{p.bio}</p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Education</h2>
            {education.map((edu: any, i: number) => (
              <div key={i} style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{edu.degree}</div>
                    <div style={{ fontSize: 14, color: '#6366f1', marginTop: 2 }}>{edu.institution}</div>
                    {edu.location && <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{edu.location}</div>}
                  </div>
                  <span style={{ fontSize: 13, color: '#9ca3af', whiteSpace: 'nowrap' }}>{edu.startDate} – {edu.endDate}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Experience</h2>
            {experience.map((exp: any, i: number) => (
              <div key={i} style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{exp.role}</div>
                    <div style={{ fontSize: 14, color: '#6366f1', marginTop: 2 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <span style={{ fontSize: 13, color: '#9ca3af', whiteSpace: 'nowrap' }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                {(exp.bullets ?? []).length > 0 && (
                  <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
                    {(exp.bullets ?? []).map((b: string, j: number) => (
                      <li key={j} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 6 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {projects.map((pr: any, i: number) => (
                <div key={i} style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 8 }}>{pr.name}</div>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: '0 0 12px' }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(pr.techStack ?? []).map((t: string, j: number) => (
                      <span key={j} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#eef2ff', color: '#4f46e5', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Skills</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {skills.map((s: any, i: number) => (
                <div key={i} style={{ padding: 20, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{s.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(s.items ?? []).map((item: string, j: number) => (
                      <span key={j} style={{ fontSize: 13, padding: '5px 12px', borderRadius: 8, background: '#f3f4f6', color: '#374151', fontWeight: 500 }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Achievements</h2>
            <div style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
                {achievements.map((a: string, i: number) => (
                  <li key={i} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.8, marginBottom: 8 }}>{a}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* ── Template Map ─────────────────────────────────────────────────────── */
const TEMPLATE_COMPONENTS: Record<TemplateId, React.FC> = {
  standard: StandardTemplate,
  minimalist: MinimalistTemplate,
  bento: BentoGridTemplate,
  creative: CreativeTemplate,
  corporate: CorporateTemplate,
};

/* ── Main Page ────────────────────────────────────────────────────────── */
export const TemplateSelection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('standard');

  const ActiveComponent = TEMPLATE_COMPONENTS[activeTemplate];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">

      {/* ── Left Sidebar ── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-black text-xl text-indigo-600 hover:opacity-90">
            artfolio<span className="inline-flex w-4 h-4 ml-0.5 rounded bg-indigo-600 text-white text-[9px] items-center justify-center font-bold align-top">↗</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {/* Template Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Layout</h3>
            <p className="text-xs text-gray-500 mb-4">Choose a template for your portfolio</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LAYOUTS.map((tmpl) => {
              const isSelected = activeTemplate === tmpl.id;
              
              // Generate custom thumbnail CSS based on template ID
              let thumbnailInner = null;
              if (tmpl.id === 'standard') {
                thumbnailInner = (
                  <div className="w-full flex-1 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-indigo-300 mb-1" />
                    <div className="w-14 h-1.5 bg-gray-400 rounded mb-1" />
                    <div className="w-20 h-1 bg-gray-300 rounded mb-2" />
                    <div className="w-full h-8 bg-white border border-gray-100 rounded-sm" />
                  </div>
                );
              } else if (tmpl.id === 'minimalist') {
                thumbnailInner = (
                  <div className="w-full flex-1 flex flex-col items-center justify-start bg-gray-50 pt-2">
                    <div className="w-24 h-3 bg-gray-800 rounded-sm mb-1" />
                    <div className="w-16 h-1 bg-gray-400 rounded mb-3" />
                    <div className="w-full h-8 bg-white border-t border-gray-200 p-1">
                      <div className="w-10 h-1 bg-gray-300 mb-1 rounded" />
                      <div className="w-full h-4 bg-gray-100 rounded" />
                    </div>
                  </div>
                );
              } else if (tmpl.id === 'bento') {
                thumbnailInner = (
                  <div className="w-full flex-1 grid grid-cols-2 gap-1 p-1">
                    <div className="col-span-2 space-y-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-400" />
                      <div className="h-1.5 w-12 bg-gray-400 rounded" />
                    </div>
                    <div className="h-6 bg-white border border-gray-200 rounded-sm" />
                    <div className="h-6 bg-white border border-gray-200 rounded-sm" />
                  </div>
                );
              } else if (tmpl.id === 'creative') {
                thumbnailInner = (
                  <div className="w-full flex-1 bg-gray-900 rounded-sm flex flex-col items-center justify-center p-1">
                    <div className="w-16 h-6 border border-gray-700 bg-gray-800 rounded flex items-center justify-center">
                      <div className="w-8 h-1 bg-indigo-500 rounded" />
                    </div>
                  </div>
                );
              } else if (tmpl.id === 'corporate') {
                thumbnailInner = (
                  <div className="w-full flex-1 flex gap-1 p-0.5">
                    <div className="w-1/3 h-full bg-white border border-gray-200 rounded-sm flex flex-col items-center p-1">
                      <div className="w-4 h-4 rounded-full bg-indigo-400 mb-1" />
                      <div className="w-full h-0.5 bg-gray-300 rounded mb-0.5" />
                      <div className="w-4/5 h-0.5 bg-gray-200 rounded mb-1" />
                      <div className="w-full h-2 bg-indigo-500 rounded-sm" />
                    </div>
                    <div className="w-2/3 flex flex-col gap-1">
                      <div className="w-full h-3 bg-white border border-gray-200 rounded-sm" />
                      <div className="w-full flex-1 bg-white border border-gray-200 rounded-sm" />
                    </div>
                  </div>
                );
              }

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
                  <div className="w-full h-20 rounded-lg bg-gray-100 mb-2 border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-transform group-hover:scale-[1.02]">
                    {thumbnailInner}
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-gray-800'}`}>
                    {tmpl.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ── Live Preview Area ── */}
      <main className="flex-1 overflow-y-auto bg-gray-100/70">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default TemplateSelection;
