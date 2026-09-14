import React, { useState, useRef } from 'react';
import {
  Target, Loader2, FileText,
  CheckCircle2, Sparkles, BarChart3, AlertCircle,
  Code2, Briefcase, Download, ArrowRight,
} from 'lucide-react';
import { api } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ResumeData } from '../types/resume';

// ─── Inline Resume Preview Component ──────────────────────────────────────────
// Re-uses the minimal-clean styling to show the resume
const MinimalPreview = React.memo(function MinimalPreview({ data }: { data: ResumeData }) {
  const p = data.personalInfo;
  const a = '#4f46e5';

  return (
    <div className="resume-preview-container" style={{ fontFamily: 'Georgia, serif', background: '#fff', color: '#111', padding: '40px 48px', fontSize: 13, lineHeight: 1.6, minHeight: '100%' }}>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Pill({ label, variant = 'default' }: { label: string; variant?: 'default' | 'required' | 'preferred' | 'keyword' }) {
  const colors = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    required: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30',
    preferred: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    keyword: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
      {label}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AtsOptimizer() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [optimizing, setOptimizing] = useState(false);

  // Step 3
  const [result, setResult] = useState<any>(null);

  // Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/api/ats-optimizer/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setActiveUploadId(data.upload.id);
      setActiveFileName(file.name);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload PDF.');
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOptimize = async () => {
    if (!activeUploadId || !jobDescription.trim() || !companyName.trim() || !roleTitle.trim()) return;
    setOptimizing(true);
    setError(null);
    try {
      const { data } = await api.post('/api/ats-optimizer/optimize', {
        uploadId: activeUploadId,
        jobDescription,
        companyName,
        roleTitle,
      });
      setResult(data);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Optimization failed. Please try again.');
    } finally {
      setOptimizing(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setActiveUploadId(null);
    setActiveFileName(null);
    setJobDescription('');
    setCompanyName('');
    setRoleTitle('');
    setResult(null);
    setError(null);
  };

  const step2Valid = jobDescription.trim().length >= 50 && companyName.trim().length > 0 && roleTitle.trim().length > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-section { display: block !important; position: absolute; left: 0; top: 0; right: 0; margin: 0; padding: 0; }
          .print-hidden { display: none !important; }
        }
      `}</style>

      {/* Main UI Container */}
      <div className="print-hidden flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">ATS Optimizer</h1>
                <p className="text-sm text-zinc-500">Upload a PDF resume, paste a JD, and get a tailored PDF.</p>
              </div>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-4 mb-8 text-sm font-medium">
            <span className={step >= 1 ? 'text-indigo-400 font-bold' : 'text-zinc-500'}>1. Upload PDF</span>
            <ArrowRight className="h-4 w-4 text-zinc-700" />
            <span className={step >= 2 ? 'text-indigo-400 font-bold' : 'text-zinc-500'}>2. Job Description</span>
            <ArrowRight className="h-4 w-4 text-zinc-700" />
            <span className={step >= 3 ? 'text-indigo-400 font-bold' : 'text-zinc-500'}>3. Preview & Download</span>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="font-bold hover:text-red-300">✕</button>
            </div>
          )}

          {/* ── Step 1: Upload ── */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div 
                className="rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 p-12 text-center hover:bg-zinc-900/80 hover:border-indigo-500/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                    <p className="text-zinc-400">Parsing your PDF...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-zinc-200">Upload your Resume (PDF)</p>
                      <p className="text-sm text-zinc-500 mt-1">This will not affect your main dashboard resumes.</p>
                    </div>
                    <Button variant="outline" className="mt-2 bg-transparent border-zinc-700 text-zinc-300 pointer-events-none">
                      Select File
                    </Button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  disabled={uploadLoading}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: JD ── */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <div className="text-sm">
                  <span className="text-zinc-300">File uploaded: </span>
                  <span className="font-semibold text-indigo-300">{activeFileName}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Company Name <span className="text-red-400">*</span></label>
                  <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Google" className="bg-zinc-900 border-zinc-800" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Role Title <span className="text-red-400">*</span></label>
                  <Input value={roleTitle} onChange={e => setRoleTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="bg-zinc-900 border-zinc-800" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Job Description <span className="text-red-400">*</span></label>
                <textarea
                  value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button onClick={() => setStep(1)} variant="outline" className="border-zinc-700 bg-transparent text-zinc-300">
                  Cancel
                </Button>
                <Button onClick={handleOptimize} disabled={!step2Valid || optimizing} className="bg-indigo-600 hover:bg-indigo-500 min-w-[180px]">
                  {optimizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze & Optimize</>}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Results Preview ── */}
          {step === 3 && result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Top Banner */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-emerald-400">Optimization Complete!</h2>
                  <p className="text-sm text-emerald-400/80 line-clamp-1">
                     ATS Score went from <span className="font-bold px-1">{result.originalAtsScore ?? '—'}</span> to <span className="font-bold px-1">{result.result.atsScore ?? '—'}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleStartOver} variant="outline" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 bg-transparent">
                    Optimize Another
                  </Button>
                  <Button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Left: The Inline Resume Preview */}
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl relative" style={{ minHeight: '800px', transformOrigin: 'top left' }}>
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-md">
                    Optimized Preview
                  </div>
                  <MinimalPreview data={result.result.parsedData} />
                </div>

                {/* Right: The Breakdown */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4 text-indigo-400" />
                      JD Extraction Analysis
                    </h3>
                    
                    <div className="space-y-5">
                      {result.result.jdDictionary.requiredSkills.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> Required Skills Injected</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.result.jdDictionary.requiredSkills.map((s: string) => <Pill key={s} label={s} variant="required" />)}
                          </div>
                        </div>
                      )}
                      
                      {result.result.jdDictionary.industryKeywords.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> ATS Keywords Used</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.result.jdDictionary.industryKeywords.map((k: string) => <Pill key={k} label={k} variant="keyword" />)}
                          </div>
                        </div>
                      )}

                      {result.result.jdDictionary.keyResponsibilities.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Reworded to Match</p>
                          <ul className="space-y-1.5">
                            {result.result.jdDictionary.keyResponsibilities.slice(0, 4).map((r: string, i: number) => (
                              <li key={i} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                                <span className="mt-1.5 h-1 w-1 rounded-full bg-indigo-400 flex-shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Print-only wrapper for the exact PDF ── */}
      {step === 3 && result && (
        <div className="print-section">
          <MinimalPreview data={result.result.parsedData} />
        </div>
      )}
    </div>
  );
}
