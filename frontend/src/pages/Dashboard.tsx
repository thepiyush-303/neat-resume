import { useState } from 'react';
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
  Download,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Resume {
  id: string;
  title: string;
  targetRole: string;
  template: string;
  templateColor: string;
  atsScore: number;
  status: 'completed' | 'draft';
  lastEdited: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USER = { name: 'Piyush', email: 'piyush@example.com' };

const MOCK_RESUMES: Resume[] = [
  {
    id: '1',
    title: 'Software Engineer — Google',
    targetRole: 'Senior Software Engineer',
    template: 'Tech Pro',
    templateColor: 'from-indigo-500 to-indigo-700',
    atsScore: 92,
    status: 'completed',
    lastEdited: '2 hours ago',
  },
  {
    id: '2',
    title: 'Frontend Developer — Stripe',
    targetRole: 'Senior Frontend Engineer',
    template: 'Modern Executive',
    templateColor: 'from-emerald-500 to-emerald-700',
    atsScore: 78,
    status: 'completed',
    lastEdited: 'Yesterday',
  },
  {
    id: '3',
    title: 'Full-Stack Dev — Notion',
    targetRole: 'Full-Stack Developer',
    template: 'Minimal Clean',
    templateColor: 'from-violet-500 to-violet-700',
    atsScore: 61,
    status: 'draft',
    lastEdited: '3 days ago',
  },
  {
    id: '4',
    title: 'ML Engineer — DeepMind',
    targetRole: 'Research Engineer',
    template: 'Creative',
    templateColor: 'from-amber-500 to-orange-600',
    atsScore: 85,
    status: 'completed',
    lastEdited: '5 days ago',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAtsColor(score: number) {
  if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return 'text-red-400 bg-red-400/10 border-red-400/20';
}

function getAtsRing(score: number) {
  if (score >= 80) return 'stroke-emerald-400';
  if (score >= 60) return 'stroke-amber-400';
  return 'stroke-red-400';
}

const avgAts = Math.round(
  MOCK_RESUMES.reduce((a, r) => a + r.atsScore, 0) / MOCK_RESUMES.length,
);

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
      {/* subtle gradient blob */}
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

function AtsRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
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
  onDownload,
  onDelete,
}: {
  resume: Resume;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40">
      {/* Thumbnail */}
      <div
        className={`relative flex h-36 items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br ${resume.templateColor}`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex flex-col items-center gap-1">
          <FileText className="h-10 w-10 text-white/80" strokeWidth={1.5} />
          <span className="text-xs font-medium text-white/70">{resume.template}</span>
        </div>
        {/* Status pill */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              resume.status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {resume.status === 'completed' ? 'Completed' : 'Draft'}
          </span>
        </div>
        {/* ATS ring */}
        <div className="absolute right-3 top-3 flex flex-col items-center">
          <div className="relative">
            <AtsRing score={resume.atsScore} />
            <span className="absolute inset-0 flex items-center justify-center rotate-90 text-xs font-bold text-white">
              {resume.atsScore}
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
            <p className="truncate text-xs text-zinc-500 mt-0.5">{resume.targetRole}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100"
            >
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-sm hover:bg-zinc-800"
                onClick={() => onEdit(resume.id)}
              >
                <Pencil className="h-3.5 w-3.5 text-zinc-400" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-sm hover:bg-zinc-800"
                onClick={() => onDuplicate(resume.id)}
              >
                <Copy className="h-3.5 w-3.5 text-zinc-400" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-sm hover:bg-zinc-800"
                onClick={() => onDownload(resume.id)}
              >
                <Download className="h-3.5 w-3.5 text-zinc-400" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-400"
                onClick={() => onDelete(resume.id)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-3">
          <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${getAtsColor(resume.atsScore)}`}>
            <BarChart3 className="h-3 w-3" />
            {resume.atsScore}% ATS
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Clock className="h-3 w-3" />
            {resume.lastEdited}
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
        Upload an existing resume or start from a blank template to get an ATS score and a
        polished design.
      </p>
      <Button
        onClick={onUpload}
        className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
      >
        <Upload className="h-4 w-4" /> Upload your first resume
      </Button>
    </div>
  );
}

// ─── Upload Dialog (lightweight inline modal) ────────────────────────────────

function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dragging, setDragging] = useState(false);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 text-lg font-semibold text-zinc-100">Upload Resume</h2>
        <p className="mb-6 text-sm text-zinc-500">Accepts PDF or DOCX · Max 5 MB</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 transition-colors ${
            dragging ? 'border-indigo-500 bg-indigo-600/10' : 'border-zinc-800 bg-zinc-900'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10">
            <Upload className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-200">
              Drop your file here, or{' '}
              <label className="cursor-pointer text-indigo-400 hover:text-indigo-300">
                browse
                <input type="file" accept=".pdf,.docx" className="sr-only" />
              </label>
            </p>
            <p className="mt-1 text-xs text-zinc-600">PDF, DOCX up to 5MB</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={onClose}
          >
            Upload & Parse
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>(MOCK_RESUMES);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'drafts' | 'completed'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  // Toggle: set to true to test empty state
  const [showEmpty, setShowEmpty] = useState(false);

  const filtered = (showEmpty ? [] : resumes).filter((r) => {
    const matchesTab =
      tab === 'all' ||
      (tab === 'drafts' && r.status === 'draft') ||
      (tab === 'completed' && r.status === 'completed');
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.targetRole.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = (id: string) => setResumes((prev) => prev.filter((r) => r.id !== id));
  const handleDuplicate = (id: string) => {
    const orig = resumes.find((r) => r.id === id);
    if (!orig) return;
    setResumes((prev) => [
      ...prev,
      { ...orig, id: Date.now().toString(), title: `${orig.title} (Copy)`, lastEdited: 'Just now' },
    ]);
  };
  const handleEdit = (id: string) => console.log('Edit', id);
  const handleDownload = (id: string) => console.log('Download', id);

  const displayAvgAts = showEmpty || resumes.length === 0 ? '—' : `${avgAts}%`;
  const lastEdited = showEmpty || resumes.length === 0 ? 'Never' : resumes[0].lastEdited;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-indigo-600/30">
              <AvatarFallback className="bg-indigo-600/20 text-indigo-300 font-bold text-lg">
                {MOCK_USER.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-100">
                  Welcome back, {MOCK_USER.name} 👋
                </h1>
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">
                Here's an overview of your resume portfolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dev toggle for empty state */}
            <button
              onClick={() => setShowEmpty((p) => !p)}
              className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
              title="Toggle empty state (dev only)"
            >
              {showEmpty ? 'Show Resumes' : 'Test Empty'}
            </button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" /> Create from Blank
            </Button>
            <Button
              className="gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              onClick={() => setUploadOpen(true)}
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
            value={showEmpty ? 0 : resumes.length}
            sub="Across all templates"
          />
          <StatCard
            icon={<Star className="h-4 w-4" />}
            label="Average ATS Score"
            value={
              <span className="flex items-center gap-2">
                {displayAvgAts}
                {!showEmpty && resumes.length > 0 && (
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
            value={
              <span className="text-xl font-bold text-zinc-100">{lastEdited}</span>
            }
            sub={showEmpty ? 'No activity yet' : `"${resumes[0].title}"`}
          />
        </div>

        {/* ── Quick Tip Banner ───────────────────────────────────────────── */}
        {!showEmpty && resumes.length > 0 && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-indigo-700/30 bg-indigo-600/5 px-5 py-4">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-indigo-400" />
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-indigo-300">Tip:</span> Your "
              {resumes[2].title}" resume has the lowest ATS score ({resumes[2].atsScore}%). Open it
              to add quantified impact bullets and relevant keywords.
            </p>
            <button className="ml-auto flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 flex-shrink-0">
              Fix it <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ── Recent Resumes Section ─────────────────────────────────────── */}
        <div>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-100">Recent Resumes</h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <Input
                  placeholder="Search resumes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-56 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
                />
              </div>

              {/* Tabs */}
              <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
                <TabsList className="rounded-xl border border-zinc-800 bg-zinc-900 p-1">
                  <TabsTrigger
                    value="all"
                    className="rounded-lg px-4 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="rounded-lg px-4 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="drafts"
                    className="rounded-lg px-4 text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Drafts
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <EmptyState onUpload={() => setUploadOpen(true)} />
            ) : (
              filtered.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDownload={handleDownload}
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
