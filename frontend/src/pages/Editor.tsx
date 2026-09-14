import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, Save, Download, ArrowLeft,
  Plus, Trash2, Loader2, CheckCircle2, Layout, Globe,
} from 'lucide-react';
import { api } from '../context/AuthContext';
import { DeployModal } from '../components/DeployModal';
import type { ResumeData, TemplateId, WorkExperience, Education, Project, SkillGroup } from '../types/resume';
import { TEMPLATE_IDS } from '../types/resume';

// Portfolio template components
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { BentoGridTemplate } from '../components/templates/BentoGridTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { CorporateTemplate } from '../components/templates/CorporateTemplate';

// ─── Inline Standard Portfolio Template ───────────────────────────────────────
const PortfolioStandardPreview = React.memo(function PortfolioStandardPreview({ data }: { data: ResumeData }) {
  const p = data.personalInfo;
  const experience = data.workExperience;
  const education = data.education;
  const projects = data.projects;
  const skills = data.skills;
  const certifications = data.certifications ?? [];
  const languages = data.languages ?? [];

  const pill: React.CSSProperties = {
    fontSize: 12, padding: '6px 14px', borderRadius: 20, background: '#f3f4f6',
    color: '#374151', textDecoration: 'none', fontWeight: 500, display: 'inline-block',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '56px 48px 40px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}>
          {p.fullName?.charAt(0) || 'U'}
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: '#111', margin: '0 0 8px', letterSpacing: -1.5, lineHeight: 1.1 }}>{p.fullName}</h1>
        {p.summary && <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 660, margin: '12px auto 0', lineHeight: 1.75 }}>{p.summary}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {p.email    && <a href={`mailto:${p.email}`} style={pill}>✉ {p.email}</a>}
          {p.phone    && <span style={pill}>📞 {p.phone}</span>}
          {p.location && <span style={pill}>📍 {p.location}</span>}
          {p.github   && <a href={p.github}   target="_blank" rel="noreferrer" style={pill}>GitHub ↗</a>}
          {p.linkedIn && <a href={p.linkedIn} target="_blank" rel="noreferrer" style={pill}>LinkedIn ↗</a>}
          {p.website  && <a href={p.website}  target="_blank" rel="noreferrer" style={pill}>Website ↗</a>}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 32px' }}>
        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionH2}>Skills</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ padding: '16px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>{s.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {s.items.map((item, j) => <span key={j} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 7, background: '#f3f4f6', color: '#374151', fontWeight: 500 }}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionH2}>Experience</h2>
            {experience.map((w, i) => (
              <div key={i} style={{ padding: '20px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{w.role}</div>
                    <div style={{ fontSize: 13, color: '#6366f1', marginTop: 2 }}>{w.company}{w.location ? ` · ${w.location}` : ''}</div>
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' as const }}>{w.startDate} – {w.endDate || 'Present'}</span>
                </div>
                {w.bullets.length > 0 && <ul style={{ margin: 0, padding: '0 0 0 18px' }}>{w.bullets.map((b, j) => <li key={j} style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, marginBottom: 5 }}>{b}</li>)}</ul>}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionH2}>Education</h2>
            {education.map((e, i) => (
              <div key={i} style={{ padding: '20px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</div>
                    <div style={{ fontSize: 13, color: '#6366f1', marginTop: 2 }}>{e.institution}</div>
                    {e.gpa && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>GPA: {e.gpa}</div>}
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' as const }}>{e.startDate} – {e.endDate || 'Present'}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionH2}>Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {projects.map((pr, i) => (
                <div key={i} style={{ padding: '20px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{pr.name}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {pr.github && <a href={pr.github} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#6366f1', textDecoration: 'none' }}>GH ↗</a>}
                      {pr.url    && <a href={pr.url}    target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#6366f1', textDecoration: 'none' }}>Live ↗</a>}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: '0 0 12px' }}>{pr.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {pr.techStack.map((t, j) => <span key={j} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: '#eef2ff', color: '#4f46e5', fontWeight: 500 }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionH2}>Certifications</h2>
            <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                {certifications.map((c, i) => <li key={i} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 6 }}>{c}</li>)}
              </ul>
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionH2}>Languages</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {languages.map((l, i) => <span key={i} style={{ fontSize: 13, padding: '6px 16px', borderRadius: 20, background: '#fff', border: '1px solid #e5e7eb', color: '#374151' }}>{l}</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

const sectionH2: React.CSSProperties = { fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 18, paddingBottom: 10, borderBottom: '2px solid #111' };

// ─── Inline Resume Preview (original template styles) ────────────────────────
const ResumePreview = React.memo(function ResumePreview({ data, templateId }: { data: ResumeData; templateId: TemplateId }) {
  // Portfolio templates — delegate to their own components
  if (templateId === 'portfolio-standard')   return <PortfolioStandardPreview data={data} />;
  if (templateId === 'portfolio-minimalist') return <MinimalistTemplate data={data} />;
  if (templateId === 'portfolio-bento')      return <BentoGridTemplate  data={data} />;
  if (templateId === 'portfolio-creative')   return <CreativeTemplate   data={data} />;
  if (templateId === 'portfolio-corporate')  return <CorporateTemplate  data={data} />;

  // Classic resume templates
  const p = data.personalInfo;
  const styles: Record<string, React.CSSProperties> = {
    'minimal-clean': { fontFamily: 'Georgia, serif', background: '#fff', color: '#111' },
    'tech-pro': { fontFamily: "'Courier New', monospace", background: '#0f172a', color: '#e2e8f0' },
    'corporate': { fontFamily: 'Arial, sans-serif', background: '#fff', color: '#1e293b' },
    'creative': { fontFamily: "'Inter', sans-serif", background: '#fafafa', color: '#111' },
    'terminal': { fontFamily: "'Fira Code', monospace", background: '#1a1a2e', color: '#00ff88' },
  };
  const accent: Record<string, string> = {
    'minimal-clean': '#4f46e5', 'tech-pro': '#38bdf8',
    'corporate': '#1d4ed8', 'creative': '#ec4899', 'terminal': '#00ff88',
  };
  const s = styles[templateId] || styles['minimal-clean'];
  const a = accent[templateId] || '#4f46e5';

  return (
    <div style={{ ...s, padding: '40px 48px', minHeight: '100%', fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ marginBottom: 24, borderBottom: `2px solid ${a}`, paddingBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', color: a }}>{p.fullName}</h1>
        <div style={{ fontSize: 12, opacity: 0.7, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {p.email    && <span>{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedIn && <span>{p.linkedIn}</span>}
          {p.github   && <span>{p.github}</span>}
        </div>
        {p.summary && <p style={{ marginTop: 12, fontSize: 12, opacity: 0.85 }}>{p.summary}</p>}
      </div>

      {data.workExperience.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>Experience</h2>
          {data.workExperience.map((w, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13 }}>{w.role}</strong>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{w.startDate} – {w.endDate || 'Present'}</span>
              </div>
              <div style={{ fontSize: 12, color: a, fontWeight: 500 }}>{w.company}{w.location ? ` · ${w.location}` : ''}</div>
              {w.bullets.length > 0 && <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>{w.bullets.map((b, j) => <li key={j} style={{ fontSize: 11, opacity: 0.85, marginBottom: 3 }}>{b}</li>)}</ul>}
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>Education</h2>
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13 }}>{e.institution}</strong>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{e.startDate} – {e.endDate || 'Present'}</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{e.degree} in {e.field}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>
            </div>
          ))}
        </section>
      )}

      {data.projects.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>Projects</h2>
          {data.projects.map((pr, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <strong style={{ fontSize: 13 }}>{pr.name}</strong>
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>{pr.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {pr.techStack.map((t, j) => <span key={j} style={{ fontSize: 10, padding: '1px 8px', border: `1px solid ${a}`, borderRadius: 10, color: a }}>{t}</span>)}
              </div>
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>Skills</h2>
          {data.skills.map((sg, i) => (
            <div key={i} style={{ marginBottom: 8, fontSize: 12 }}>
              <strong>{sg.category}: </strong>
              <span style={{ opacity: 0.8 }}>{sg.items.join(', ')}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
});

// ─── Form Helpers ─────────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-sm font-semibold text-zinc-100 transition-colors">
        {title}
        {open ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
      </button>
      {open && <div className="p-4 space-y-3 bg-zinc-950">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, textarea, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void; textarea?: boolean; type?: string;
}) {
  const cls = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
      {textarea ? (
        <textarea className={`${cls} resize-none`} rows={3} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type} className={cls} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

type SaveStatus = 'saved' | 'saving' | 'unsaved';

// ─── Editor Page ──────────────────────────────────────────────────────────────
export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('minimal-clean');
  const [title, setTitle] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(620);
  const isResizing = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSavedRef = useRef<string>('');

  // Load resume
  useEffect(() => {
    if (!id) return;
    api.get(`/api/resumes/${id}`)
      .then(({ data: res }) => {
        setData(res.resume.parsedData as ResumeData);
        setTemplateId(res.resume.templateId as TemplateId);
        setTitle(res.resume.title);
        setAtsScore(res.resume.atsScore);
        setPortfolioUrl(res.resume.portfolioUrl || null);
        lastSavedRef.current = JSON.stringify({ data: res.resume.parsedData, templateId: res.resume.templateId, title: res.resume.title });
      })
      .catch(() => setError('Failed to load resume.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Save
  const save = useCallback(async (currentData: ResumeData, tId: TemplateId, t: string) => {
    if (!id) return;
    setSaveStatus('saving');
    try {
      const { data: res } = await api.patch(`/api/resumes/${id}`, { parsedData: currentData, templateId: tId, title: t });
      setAtsScore(res.resume.atsScore);
      lastSavedRef.current = JSON.stringify({ data: currentData, templateId: tId, title: t });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  }, [id]);

  // Auto-save
  useEffect(() => {
    if (!data) return;
    const serialized = JSON.stringify({ data, templateId, title });
    if (serialized === lastSavedRef.current) return;
    setSaveStatus('unsaved');
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => save(data, templateId, title), 1500);
    return () => clearTimeout(autoSaveRef.current);
  }, [data, templateId, title, save]);

  // ── Sidebar resize handlers ──
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;

    const onMove = (mv: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = mv.clientX - dragStartX.current;
      const newW = Math.min(Math.max(dragStartWidth.current + delta, 280), 1000);
      setSidebarWidth(newW);
    };
    const onUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Update helpers
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData(prev => prev ? { ...prev, [key]: value } : prev);
  };
  const updatePersonal = (field: string, value: string) => {
    setData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, [field]: value } } : prev);
  };
  const updateWorkExp = (idx: number, field: keyof WorkExperience, value: string | string[]) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.workExperience]; updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };
  const updateEducation = (idx: number, field: keyof Education, value: string | number | null) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.education]; updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, education: updated };
    });
  };
  const updateProject = (idx: number, field: keyof Project, value: string | string[]) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.projects]; updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, projects: updated };
    });
  };
  const updateSkill = (idx: number, field: keyof SkillGroup, value: string | string[]) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.skills]; updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, skills: updated };
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-sm">{error || 'Resume not found.'}</p>
      <button onClick={() => navigate('/dashboard')} className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to Dashboard</button>
    </div>
  );

  const isPortfolioTemplate = templateId.startsWith('portfolio-');

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">

      {/* ─── Left Sidebar ─────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex flex-col border-r border-zinc-800 overflow-hidden"
        style={{ width: sidebarWidth }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <button onClick={() => navigate('/editor')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Resumes
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 flex items-center gap-1">
              {saveStatus === 'saving'  && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
              {saveStatus === 'saved'   && <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Saved</>}
              {saveStatus === 'unsaved' && 'Unsaved'}
            </span>
            <button onClick={() => save(data, templateId, title)} className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">
              <Save className="h-3 w-3" /> Save
            </button>
            <button onClick={() => setDeployModalOpen(true)} className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              <Globe className="h-3 w-3" /> Publish
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors">
              <Download className="h-3 w-3" /> PDF
            </button>
          </div>
        </div>

        {/* Title & ATS */}
        <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <input className="w-full bg-transparent text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-600" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resume title..." />
          {atsScore !== null && (
            <div className={`mt-1 text-xs font-medium flex items-center gap-1 ${atsScore >= 80 ? 'text-emerald-400' : atsScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
              ATS Score: {atsScore}/100
            </div>
          )}
          {portfolioUrl && (
            <div className="mt-1 text-xs font-medium flex items-center gap-1 text-sky-400">
              <a href={portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                <Globe className="h-3 w-3" /> Live: {portfolioUrl.replace('https://', '')}
              </a>
            </div>
          )}
        </div>

        {/* Template Switcher */}
        <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
            <Layout className="h-3.5 w-3.5" /> Template
          </label>
          <select value={templateId} onChange={e => setTemplateId(e.target.value as TemplateId)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all">
            <optgroup label="Resume Templates">
              {TEMPLATE_IDS.filter(t => !t.id.startsWith('portfolio-')).map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </optgroup>
            <optgroup label="Portfolio Templates (GitHub Pages)">
              {TEMPLATE_IDS.filter(t => t.id.startsWith('portfolio-')).map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </optgroup>
          </select>
          {isPortfolioTemplate && (
            <p className="mt-1.5 text-xs text-indigo-400">
              ✦ Portfolio mode — click Publish to deploy to GitHub Pages
            </p>
          )}
        </div>

        {/* Form Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          <Section title="Personal Info">
            <Field label="Full Name" value={data.personalInfo.fullName} onChange={v => updatePersonal('fullName', v)} />
            <Field label="Email" value={data.personalInfo.email} onChange={v => updatePersonal('email', v)} type="email" />
            <Field label="Phone" value={data.personalInfo.phone || ''} onChange={v => updatePersonal('phone', v)} />
            <Field label="Location" value={data.personalInfo.location || ''} onChange={v => updatePersonal('location', v)} />
            <Field label="LinkedIn" value={data.personalInfo.linkedIn || ''} onChange={v => updatePersonal('linkedIn', v)} />
            <Field label="GitHub" value={data.personalInfo.github || ''} onChange={v => updatePersonal('github', v)} />
            <Field label="Website" value={data.personalInfo.website || ''} onChange={v => updatePersonal('website', v)} />
            <Field label="Summary" value={data.personalInfo.summary} onChange={v => updatePersonal('summary', v)} textarea />
          </Section>

          <Section title={`Experience (${data.workExperience.length})`} defaultOpen={false}>
            {data.workExperience.map((w, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{w.company || `Entry ${i + 1}`}</span>
                  <button onClick={() => update('workExperience', data.workExperience.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Company" value={w.company} onChange={v => updateWorkExp(i, 'company', v)} />
                <Field label="Role" value={w.role} onChange={v => updateWorkExp(i, 'role', v)} />
                <Field label="Start Date (YYYY-MM)" value={w.startDate} onChange={v => updateWorkExp(i, 'startDate', v)} />
                <Field label="End Date (YYYY-MM or Present)" value={w.endDate || ''} onChange={v => updateWorkExp(i, 'endDate', v)} />
                <Field label="Location" value={w.location || ''} onChange={v => updateWorkExp(i, 'location', v)} />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Bullets (one per line)</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 resize-none transition-all" rows={4} value={w.bullets.join('\n')} onChange={e => updateWorkExp(i, 'bullets', e.target.value.split('\n'))} />
                </div>
              </div>
            ))}
            <button onClick={() => update('workExperience', [...data.workExperience, { company: '', role: '', startDate: '', endDate: '', location: '', bullets: [] }])} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3.5 w-3.5" /> Add Experience
            </button>
          </Section>

          <Section title={`Education (${data.education.length})`} defaultOpen={false}>
            {data.education.map((e, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{e.institution || `Entry ${i + 1}`}</span>
                  <button onClick={() => update('education', data.education.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Institution" value={e.institution} onChange={v => updateEducation(i, 'institution', v)} />
                <Field label="Degree" value={e.degree} onChange={v => updateEducation(i, 'degree', v)} />
                <Field label="Field of Study" value={e.field} onChange={v => updateEducation(i, 'field', v)} />
                <Field label="Start Date" value={e.startDate} onChange={v => updateEducation(i, 'startDate', v)} />
                <Field label="End Date" value={e.endDate || ''} onChange={v => updateEducation(i, 'endDate', v)} />
                <Field label="GPA (optional)" value={e.gpa ?? ''} onChange={v => updateEducation(i, 'gpa', v ? parseFloat(v) : null)} type="number" />
              </div>
            ))}
            <button onClick={() => update('education', [...data.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: null, honors: null }])} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3.5 w-3.5" /> Add Education
            </button>
          </Section>

          <Section title={`Projects (${data.projects.length})`} defaultOpen={false}>
            {data.projects.map((pr, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{pr.name || `Project ${i + 1}`}</span>
                  <button onClick={() => update('projects', data.projects.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Name" value={pr.name} onChange={v => updateProject(i, 'name', v)} />
                <Field label="Description" value={pr.description} onChange={v => updateProject(i, 'description', v)} textarea />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Tech Stack (comma separated)</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all" value={pr.techStack.join(', ')} onChange={e => updateProject(i, 'techStack', e.target.value.split(',').map(t => t.trimStart()))} />
                </div>
                <Field label="GitHub URL" value={pr.github || ''} onChange={v => updateProject(i, 'github', v)} />
                <Field label="Live URL" value={pr.url || ''} onChange={v => updateProject(i, 'url', v)} />
              </div>
            ))}
            <button onClick={() => update('projects', [...data.projects, { name: '', description: '', techStack: [], url: null, github: null, bullets: [] }])} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3.5 w-3.5" /> Add Project
            </button>
          </Section>

          <Section title={`Skills (${data.skills.length} groups)`} defaultOpen={false}>
            {data.skills.map((sg, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{sg.category || `Group ${i + 1}`}</span>
                  <button onClick={() => update('skills', data.skills.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Category" value={sg.category} onChange={v => updateSkill(i, 'category', v)} />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Skills (comma separated)</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all" value={sg.items.join(', ')} onChange={e => updateSkill(i, 'items', e.target.value.split(',').map(t => t.trimStart()))} />
                </div>
              </div>
            ))}
            <button onClick={() => update('skills', [...data.skills, { category: '', items: [] }])} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3.5 w-3.5" /> Add Skill Group
            </button>
          </Section>

          {/* Certifications */}
          <Section title={`Certifications (${(data.certifications ?? []).length})`} defaultOpen={false}>
            {(data.certifications ?? []).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all" value={c} onChange={e => { const arr = [...(data.certifications ?? [])]; arr[i] = e.target.value; update('certifications', arr); }} />
                <button onClick={() => update('certifications', (data.certifications ?? []).filter((_, j) => j !== i))} className="text-red-500 hover:text-red-400 flex-shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <button onClick={() => update('certifications', [...(data.certifications ?? []), ''])} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3.5 w-3.5" /> Add Certification
            </button>
          </Section>

          {/* Languages */}
          <Section title={`Languages (${(data.languages ?? []).length})`} defaultOpen={false}>
            {(data.languages ?? []).map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all" value={l} onChange={e => { const arr = [...(data.languages ?? [])]; arr[i] = e.target.value; update('languages', arr); }} />
                <button onClick={() => update('languages', (data.languages ?? []).filter((_, j) => j !== i))} className="text-red-500 hover:text-red-400 flex-shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <button onClick={() => update('languages', [...(data.languages ?? []), ''])} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3.5 w-3.5" /> Add Language
            </button>
          </Section>

        </div>
      </div>

      {/* ─── Resize Handle ────────────────────────────────────────────────── */}
      <div
        onMouseDown={onMouseDown}
        className="w-1 flex-shrink-0 bg-zinc-800 hover:bg-indigo-600 cursor-col-resize transition-colors duration-150 relative group"
        title="Drag to resize"
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-indigo-600/10 transition-colors" />
      </div>

      {/* ─── Right Preview Panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <span className="text-xs font-medium text-zinc-400">
            Preview · {TEMPLATE_IDS.find(t => t.id === templateId)?.label}
            {isPortfolioTemplate && <span className="ml-2 text-indigo-400">— Portfolio</span>}
          </span>
          <span className="text-xs text-zinc-600">Changes save automatically</span>
        </div>
        <div className="flex-1 overflow-y-auto print:overflow-visible">
          <div className={`min-h-full shadow-2xl mx-auto print:mx-0 print:shadow-none ${isPortfolioTemplate ? 'bg-transparent' : 'bg-white'}`} style={{ maxWidth: isPortfolioTemplate ? '100%' : 900 }}>
            <ResumePreview data={data} templateId={templateId} />
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          .flex.h-screen > div:last-child { display: block !important; }
          .flex.h-screen > div:first-child { display: none !important; }
        }
      `}</style>

      <DeployModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        resumeId={id as string}
        templateId={templateId}
        onDeployed={(url) => setPortfolioUrl(url)}
      />
    </div>
  );
}
