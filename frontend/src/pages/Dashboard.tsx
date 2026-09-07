import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Upload,
  MoreVertical,
  Search,
  Star,
  Clock,
  BarChart3,
  Pencil,
  Copy,
  Trash2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { api, useAuth } from '../context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Resume {
  id: string;
  title: string;
  templateId: string;
  atsScore: number | null;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAtsColor(score: number | null) {
  if (score === null) return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
  if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return 'text-red-400 bg-red-400/10 border-red-400/20';
}

function getAtsRing(score: number | null) {
  if (score === null) return 'stroke-zinc-600';
  if (score >= 80) return 'stroke-emerald-400';
  if (score >= 60) return 'stroke-amber-400';
  return 'stroke-red-400';
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-shadow hover:shadow-lg hover:shadow-black/30">
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-600/10 blur-2xl" />
      <div className="mb-3 flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{sub}</div>
    </div>
  );
}

function AtsRing({ score }: { score: number | null }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = score !== null ? circ - (score / 100) * circ : circ;
  return (
    <svg width="52" height="52" className="-rotate-90">
      <circle cx="26" cy="26" r={r} strokeWidth="4" stroke="#27272a" fill="none" />
      <circle
        cx="26"
        cy="26"
        r={r}
        strokeWidth="4"
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`transition-all duration-700 ${getAtsRing(score)}`}
      />
    </svg>
  );
}

function ResumeCard({
  resume,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  resume: Resume;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const templateColors: Record<string, string> = {
    'minimal-clean': 'from-indigo-500 to-indigo-700',
    'tech-pro': 'from-sky-500 to-sky-700',
    'corporate': 'from-blue-600 to-blue-800',
    'creative': 'from-pink-500 to-pink-700',
    'terminal': 'from-emerald-500 to-emerald-700',
  };
  const color = templateColors[resume.templateId] || 'from-zinc-600 to-zinc-800';

  return (
    <div 
      className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40 cursor-pointer overflow-hidden"
      onClick={() => onEdit(resume.id)}
    >
      {/* Thumbnail */}
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${color}`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300" />
        
        {/* Hover action overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 scale-95 group-hover:scale-100">
          <Button 
            variant="secondary" 
            className="gap-2 shadow-lg hover:scale-105 pointer-events-auto transition-transform"
            onClick={(e) => { e.stopPropagation(); onEdit(resume.id); }}
          >
            <Pencil className="h-4 w-4" /> Open Editor
          </Button>
        </div>

        <div className="relative flex flex-col items-center gap-1 group-hover:opacity-0 transition-opacity duration-300">
          <FileText className="h-10 w-10 text-white/80" strokeWidth={1.5} />
          <span className="text-xs font-medium text-white/70">{resume.templateId}</span>
        </div>
        
        {/* ATS ring */}
        <div className="absolute right-3 top-3 flex flex-col items-center group-hover:opacity-0 transition-opacity duration-300">
          <div className="relative">
            <AtsRing score={resume.atsScore} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {resume.atsScore ?? '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
              {resume.title}
            </h3>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex-shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100">
                <DropdownMenuItem className="cursor-pointer gap-2 text-sm hover:bg-zinc-800" onClick={(e) => { e.stopPropagation(); onEdit(resume.id); }}>
                  <Pencil className="h-3.5 w-3.5 text-zinc-400" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 text-sm hover:bg-zinc-800" onClick={(e) => { e.stopPropagation(); onDuplicate(resume.id); }}>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-400"
                  onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-3">
          <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${getAtsColor(resume.atsScore)}`}>
            <BarChart3 className="h-3 w-3" />
            {resume.atsScore !== null ? `${resume.atsScore}% ATS` : 'Scoring...'}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Clock className="h-3 w-3" />
            {relativeTime(resume.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 ring-1 ring-indigo-600/20">
        <FileText className="h-8 w-8 text-indigo-400" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-zinc-200">No resumes yet</h3>
      <p className="mb-6 max-w-xs text-sm text-zinc-500">
        Upload an existing resume or start from a blank template to get an ATS score and a polished design.
      </p>
      <Button onClick={onUpload} className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
        <Upload className="h-4 w-4" /> Upload your first resume
      </Button>
    </div>
  );
}

function SkeletonCard() {
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-900 h-64 animate-pulse" />;
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/resumes')
      .then(({ data }) => setResumes(data.resumes))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.name?.split(' ')[0] || 'there';
  const avgAts = resumes.length > 0
    ? Math.round(resumes.reduce((a, r) => a + (r.atsScore ?? 0), 0) / resumes.length)
    : 0;
  const lastEdited = resumes.length > 0 ? relativeTime(resumes[0].updatedAt) : 'Never';

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch {}
  };

  const handleDuplicate = async (id: string) => {
    try {
      const { data } = await api.post(`/api/resumes/${id}/duplicate`);
      setResumes(prev => [...prev, data.resume]);
    } catch {}
  };

  const handleEdit = (id: string) => navigate(`/resumes/${id}/edit`);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-indigo-600/30">
              <AvatarFallback className="bg-indigo-600/20 text-indigo-300 font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">
                Welcome back, {displayName} 👋
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">Here's an overview of your resume portfolio.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" /> Create from Blank
            </Button>
            <Button
              className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              onClick={() => navigate('/resumes/upload')}
            >
              <Upload className="h-4 w-4" /> Upload Resume
            </Button>
          </div>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="Total Resumes"
            value={loading ? '...' : resumes.length}
            sub="Across all templates"
          />
          <StatCard
            icon={<Star className="h-4 w-4" />}
            label="Average ATS Score"
            value={
              <span className="flex items-center gap-2">
                {loading ? '...' : resumes.length > 0 ? `${avgAts}%` : '—'}
                {!loading && resumes.length > 0 && (
                  <Badge className="rounded-full bg-emerald-500/10 text-emerald-400 border-emerald-400/20 text-xs font-semibold">
                    {avgAts >= 80 ? '🔥 Strong' : avgAts >= 60 ? '⚡ Good' : '⚠ Needs work'}
                  </Badge>
                )}
              </span>
            }
            sub="Resume match with job descriptions"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Last Activity"
            value={<span className="text-xl font-bold text-zinc-100">{loading ? '...' : lastEdited}</span>}
            sub={resumes.length > 0 ? `"${resumes[0].title}"` : 'No activity yet'}
          />
        </div>

        {/* ── Tip Banner ─────────────────────────────────────────────────── */}
        {!loading && resumes.length > 0 && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-indigo-700/30 bg-indigo-600/5 px-5 py-4">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-indigo-400" />
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-indigo-300">Tip:</span> Click on any resume card to
              open the live editor and update your data, switch templates, and download as PDF.
            </p>
            <button
              onClick={() => resumes.length > 0 && handleEdit(resumes[0].id)}
              className="ml-auto flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 flex-shrink-0"
            >
              Open latest <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ── Recent Resumes Section ─────────────────────────────────────── */}
        <div>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-100">My Resumes</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <Input
                  placeholder="Search resumes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-56 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <EmptyState onUpload={() => navigate('/resumes/upload')} />
            ) : (
              filtered.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
