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

// ─── Inline Template Preview ─────────────────────────────────────────────────
// A lightweight, self-contained HTML resume renderer that accepts ResumeData props.

const ResumePreview = React.memo(function ResumePreview({ data, templateId }: { data: ResumeData; templateId: TemplateId }) {
  const p = data.personalInfo;
  const styles: Record<TemplateId, React.CSSProperties> = {
    'minimal-clean': { fontFamily: 'Georgia, serif', background: '#fff', color: '#111' },
    'tech-pro': { fontFamily: "'Courier New', monospace", background: '#0f172a', color: '#e2e8f0' },
    'corporate': { fontFamily: 'Arial, sans-serif', background: '#fff', color: '#1e293b' },
    'creative': { fontFamily: "'Inter', sans-serif", background: '#fafafa', color: '#111' },
    'terminal': { fontFamily: "'Fira Code', monospace", background: '#1a1a2e', color: '#00ff88' },
  };
  const accent: Record<TemplateId, string> = {
    'minimal-clean': '#4f46e5',
    'tech-pro': '#38bdf8',
    'corporate': '#1d4ed8',
    'creative': '#ec4899',
    'terminal': '#00ff88',
  };
  const s = styles[templateId] || styles['minimal-clean'];
  const a = accent[templateId] || '#4f46e5';

  return (
    <div style={{ ...s, padding: '40px 48px', minHeight: '100%', fontSize: 13, lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ marginBottom: 24, borderBottom: `2px solid ${a}`, paddingBottom: 16 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', color: a }}>{p.fullName}</h1>
        <div style={{ fontSize: 12, opacity: 0.7, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedIn && <span>{p.linkedIn}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
        {p.summary && <p style={{ marginTop: 12, fontSize: 12, opacity: 0.85 }}>{p.summary}</p>}
      </div>

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>
            Experience
          </h2>
          {data.workExperience.map((w, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13 }}>{w.role}</strong>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{w.startDate} – {w.endDate || 'Present'}</span>
              </div>
              <div style={{ fontSize: 12, color: a, fontWeight: 500 }}>{w.company}{w.location ? ` · ${w.location}` : ''}</div>
              {w.bullets.length > 0 && (
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  {w.bullets.map((b, j) => <li key={j} style={{ fontSize: 11, opacity: 0.85, marginBottom: 3 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>
            Education
          </h2>
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

      {/* Projects */}
      {data.projects.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>
            Projects
          </h2>
          {data.projects.map((pr, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <strong style={{ fontSize: 13 }}>{pr.name}</strong>
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>{pr.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {pr.techStack.map((t, j) => (
                  <span key={j} style={{ fontSize: 10, padding: '1px 8px', border: `1px solid ${a}`, borderRadius: 10, color: a }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a, marginBottom: 12 }}>
            Skills
          </h2>
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-sm font-semibold text-zinc-100 transition-colors"
      >
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

// ─── Save Status ──────────────────────────────────────────────────────────────

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
  
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSavedRef = useRef<string>('');

  // Load resume from backend
  useEffect(() => {
    if (!id) return;
    api.get(`/api/resumes/${id}`)
      .then(({ data: res }) => {
        setData(res.resume.parsedData as ResumeData);
        setTemplateId(res.resume.templateId as TemplateId);
        setTitle(res.resume.title);
        setAtsScore(res.resume.atsScore);
        setPortfolioUrl(res.resume.portfolioUrl || null);
        lastSavedRef.current = JSON.stringify({
          data: res.resume.parsedData,
          templateId: res.resume.templateId,
          title: res.resume.title,
        });
      })
      .catch(() => setError('Failed to load resume.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Save to backend
  const save = useCallback(async (currentData: ResumeData, tId: TemplateId, t: string) => {
    if (!id) return;
    setSaveStatus('saving');
    try {
      const { data: res } = await api.patch(`/api/resumes/${id}`, {
        parsedData: currentData,
        templateId: tId,
        title: t,
      });
      setAtsScore(res.resume.atsScore);
      lastSavedRef.current = JSON.stringify({
        data: currentData,
        templateId: tId,
        title: t,
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  }, [id]);

  // Auto-save on data change (debounced 1.5s)
  useEffect(() => {
    if (!data) return;
    const serialized = JSON.stringify({ data, templateId, title });
    if (serialized === lastSavedRef.current) return;
    setSaveStatus('unsaved');

    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      save(data, templateId, title);
    }, 1500);

    return () => clearTimeout(autoSaveRef.current);
  }, [data, templateId, title, save]);

  // Update helper
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const updatePersonal = (field: string, value: string) => {
    setData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, [field]: value } } : prev);
  };

  const updateWorkExp = (idx: number, field: keyof WorkExperience, value: string | string[]) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.workExperience];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const updateEducation = (idx: number, field: keyof Education, value: string | number | null) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.education];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const updateProject = (idx: number, field: keyof Project, value: string | string[]) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.projects];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const updateSkill = (idx: number, field: keyof SkillGroup, value: string | string[]) => {
    setData(prev => {
      if (!prev) return prev;
      const updated = [...prev.skills];
      updated[idx] = { ...updated[idx], [field]: value };
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
      <button onClick={() => navigate('/dashboard')} className="text-indigo-400 hover:text-indigo-300 text-sm">
        ← Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">

      {/* ─── Left Sidebar ───────────────────────────────────────────── */}
      <div className="w-[360px] flex-shrink-0 flex flex-col border-r border-zinc-800 overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </button>
          <div className="flex items-center gap-2">
            {/* Save status */}
            <span className="text-xs text-zinc-600 flex items-center gap-1">
              {saveStatus === 'saving' && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
              {saveStatus === 'saved' && <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Saved</>}
              {saveStatus === 'unsaved' && 'Unsaved'}
            </span>
            <button
              onClick={() => save(data, templateId, title)}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
            <button
              onClick={() => setDeployModalOpen(true)}
              className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Globe className="h-3 w-3" />
              Publish
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Download className="h-3 w-3" />
              PDF
            </button>
          </div>
        </div>

        {/* Title & ATS */}
        <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <input
            className="w-full bg-transparent text-sm font-semibold text-zinc-100 outline-none placeholder:text-zinc-600"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Resume title..."
          />
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
          <select
            value={templateId}
            onChange={e => setTemplateId(e.target.value as TemplateId)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
          >
            {TEMPLATE_IDS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Form Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* Personal Info */}
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

          {/* Work Experience */}
          <Section title={`Experience (${data.workExperience.length})`} defaultOpen={false}>
            {data.workExperience.map((w, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{w.company || `Entry ${i + 1}`}</span>
                  <button onClick={() => update('workExperience', data.workExperience.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Company" value={w.company} onChange={v => updateWorkExp(i, 'company', v)} />
                <Field label="Role" value={w.role} onChange={v => updateWorkExp(i, 'role', v)} />
                <Field label="Start Date (YYYY-MM)" value={w.startDate} onChange={v => updateWorkExp(i, 'startDate', v)} />
                <Field label="End Date (YYYY-MM or Present)" value={w.endDate || ''} onChange={v => updateWorkExp(i, 'endDate', v)} />
                <Field label="Location" value={w.location || ''} onChange={v => updateWorkExp(i, 'location', v)} />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Bullets (one per line)</label>
                  <textarea
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 resize-none transition-all"
                    rows={4}
                    value={w.bullets.join('\n')}
                    onChange={e => updateWorkExp(i, 'bullets', e.target.value.split('\n'))}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => update('workExperience', [...data.workExperience, { company: '', role: '', startDate: '', endDate: '', location: '', bullets: [] }])}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="h-3.5 w-3.5" /> Add Experience
            </button>
          </Section>

          {/* Education */}
          <Section title={`Education (${data.education.length})`} defaultOpen={false}>
            {data.education.map((e, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{e.institution || `Entry ${i + 1}`}</span>
                  <button onClick={() => update('education', data.education.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Institution" value={e.institution} onChange={v => updateEducation(i, 'institution', v)} />
                <Field label="Degree" value={e.degree} onChange={v => updateEducation(i, 'degree', v)} />
                <Field label="Field of Study" value={e.field} onChange={v => updateEducation(i, 'field', v)} />
                <Field label="Start Date" value={e.startDate} onChange={v => updateEducation(i, 'startDate', v)} />
                <Field label="End Date" value={e.endDate || ''} onChange={v => updateEducation(i, 'endDate', v)} />
                <Field label="GPA (optional)" value={e.gpa ?? ''} onChange={v => updateEducation(i, 'gpa', v ? parseFloat(v) : null)} type="number" />
              </div>
            ))}
            <button
              onClick={() => update('education', [...data.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: null, honors: null }])}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="h-3.5 w-3.5" /> Add Education
            </button>
          </Section>

          {/* Projects */}
          <Section title={`Projects (${data.projects.length})`} defaultOpen={false}>
            {data.projects.map((pr, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{pr.name || `Project ${i + 1}`}</span>
                  <button onClick={() => update('projects', data.projects.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Name" value={pr.name} onChange={v => updateProject(i, 'name', v)} />
                <Field label="Description" value={pr.description} onChange={v => updateProject(i, 'description', v)} textarea />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Tech Stack (comma separated)</label>
                  <input
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
                    value={pr.techStack.join(', ')}
                    onChange={e => updateProject(i, 'techStack', e.target.value.split(',').map(t => t.trimStart()))}
                  />
                </div>
                <Field label="GitHub URL" value={pr.github || ''} onChange={v => updateProject(i, 'github', v)} />
                <Field label="Live URL" value={pr.url || ''} onChange={v => updateProject(i, 'url', v)} />
              </div>
            ))}
            <button
              onClick={() => update('projects', [...data.projects, { name: '', description: '', techStack: [], url: null, github: null, bullets: [] }])}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="h-3.5 w-3.5" /> Add Project
            </button>
          </Section>

          {/* Skills */}
          <Section title={`Skills (${data.skills.length} groups)`} defaultOpen={false}>
            {data.skills.map((sg, i) => (
              <div key={i} className="space-y-2 border border-zinc-800 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-300">{sg.category || `Group ${i + 1}`}</span>
                  <button onClick={() => update('skills', data.skills.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <Field label="Category" value={sg.category} onChange={v => updateSkill(i, 'category', v)} />
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Skills (comma separated)</label>
                  <input
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
                    value={sg.items.join(', ')}
                    onChange={e => updateSkill(i, 'items', e.target.value.split(',').map(t => t.trimStart()))}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => update('skills', [...data.skills, { category: '', items: [] }])}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="h-3.5 w-3.5" /> Add Skill Group
            </button>
          </Section>
        </div>
      </div>

      {/* ─── Right Preview Panel ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
          <span className="text-xs font-medium text-zinc-400">Preview · {TEMPLATE_IDS.find(t => t.id === templateId)?.label}</span>
          <span className="text-xs text-zinc-600">Changes save automatically</span>
        </div>
        <div className="flex-1 overflow-y-auto print:overflow-visible">
          <div className="min-h-full bg-white shadow-2xl mx-auto print:mx-0 print:shadow-none" style={{ maxWidth: 900 }}>
            <ResumePreview data={data} templateId={templateId} />
          </div>
        </div>
      </div>

      {/* Print styles */}
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
        onDeployed={(url) => setPortfolioUrl(url)} 
      />
    </div>
  );
}
