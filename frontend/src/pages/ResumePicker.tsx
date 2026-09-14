import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, BarChart3, Pencil, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '../context/AuthContext';

interface Resume {
  id: string;
  title: string;
  templateId: string;
  atsScore: number | null;
  updatedAt: string;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function atsColor(score: number | null) {
  if (score === null) return 'text-zinc-500';
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

export default function ResumePicker() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/api/resumes')
      .then(({ data }) => setResumes(data.resumes))
      .catch(() => setError('Failed to load resumes.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Select Resume to Edit</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Choose a resume below to open it in the full editor where you can change templates, edit data, and publish.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-2xl border border-zinc-800 bg-zinc-900 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 ring-1 ring-indigo-600/20">
              <FileText className="h-7 w-7 text-indigo-400" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-200">No resumes yet</h3>
            <p className="mb-6 max-w-xs text-sm text-zinc-500">Upload a resume first to get started.</p>
            <Button onClick={() => navigate('/resumes/upload')} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500">
              <Upload className="h-4 w-4" /> Upload Resume
            </Button>
          </div>
        )}

        {/* Resume list */}
        {!loading && resumes.length > 0 && (
          <div className="flex flex-col gap-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="group flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-indigo-600/50 hover:bg-zinc-900/80 cursor-pointer"
                onClick={() => navigate(`/resumes/${resume.id}/edit`)}
              >
                {/* Icon */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
                  <FileText className="h-5 w-5" strokeWidth={1.5} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                    {resume.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-xs text-zinc-600 capitalize">{resume.templateId.replace(/-/g, ' ')}</span>
                    {resume.atsScore !== null && (
                      <span className={`flex items-center gap-1 text-xs font-medium ${atsColor(resume.atsScore)}`}>
                        <BarChart3 className="h-3 w-3" /> {resume.atsScore}% ATS
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-zinc-600">
                      <Clock className="h-3 w-3" /> {relativeTime(resume.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  size="sm"
                  className="flex-shrink-0 gap-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); navigate(`/resumes/${resume.id}/edit`); }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Open Editor
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload CTA */}
        {!loading && resumes.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/resumes/upload')}
              className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <Upload className="h-3.5 w-3.5" /> Upload another resume
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  );
}
