import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Sparkles, FileText, Zap, BarChart3, Layers, CheckCircle2,
  ArrowRight, Menu, X, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'AI-Powered Parsing',
    desc: 'Upload any PDF or DOCX resume and Gemini AI instantly extracts every section into a structured, editable profile.',
    color: 'from-indigo-500/20 to-indigo-500/5',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/20',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Live ATS Scoring',
    desc: 'Know exactly how your resume ranks against Applicant Tracking Systems in real time as you edit.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: 'Beautiful Templates',
    desc: 'Five hand-crafted templates — from minimal to creative — that switch live while you edit.',
    color: 'from-violet-500/20 to-violet-500/5',
    accent: 'text-violet-400',
    border: 'border-violet-500/20',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Instant Updates',
    desc: 'Changes to your resume data reflect on the template preview in under 500ms — no page reloads.',
    color: 'from-amber-500/20 to-amber-500/5',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'One-Click PDF Export',
    desc: 'Download a pixel-perfect PDF of your final resume directly from the editor, printer-ready.',
    color: 'from-sky-500/20 to-sky-500/5',
    accent: 'text-sky-400',
    border: 'border-sky-500/20',
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: 'Persistent Storage',
    desc: 'All your resumes are saved securely in the cloud. Pick up right where you left off, any device.',
    color: 'from-rose-500/20 to-rose-500/5',
    accent: 'text-rose-400',
    border: 'border-rose-500/20',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for a quick resume refresh.',
    cta: 'Get started free',
    highlight: false,
    features: ['2 resumes', '3 templates', 'AI parsing', 'PDF export', 'ATS scoring'],
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'For serious job seekers who need every edge.',
    cta: 'Start 7-day free trial',
    highlight: true,
    badge: 'Most Popular',
    features: ['Unlimited resumes', 'All 5 templates', 'AI parsing + suggestions', 'PDF export', 'ATS scoring', 'Priority support', 'Version history'],
  },
  {
    name: 'Lifetime',
    price: '$49',
    period: 'one-time',
    desc: 'Pay once, use forever. No subscription.',
    cta: 'Buy lifetime access',
    highlight: false,
    features: ['Everything in Pro', 'Lifetime updates', 'All future templates', 'Priority support'],
  },
];

const TESTIMONIALS = [
  { name: 'Anika Sharma', role: 'SDE @ Google', text: 'Got an ATS score of 95 and landed 3 interviews in a week. This tool is insane.', stars: 5 },
  { name: 'Marcus Lee', role: 'ML Engineer @ Meta', text: 'The live preview is a game-changer. I switched templates 5 times before finding the right one.', stars: 5 },
  { name: 'Priya Nair', role: 'Frontend Dev @ Stripe', text: 'Parsed my 3-page PDF in seconds. Saved me 2 hours of reformatting.', stars: 5 },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onSignIn, onSignUp }: { onSignIn: () => void; onSignUp: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-zinc-100">NeatResume</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-zinc-100 transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-zinc-100 transition-colors">Reviews</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={onSignIn} className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
            Sign In
          </Button>
          <Button onClick={onSignUp} className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20">
            Get started free
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-zinc-400" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 px-6 py-4 space-y-4 bg-zinc-950">
          <a href="#features" className="block text-sm text-zinc-400 hover:text-zinc-100">Features</a>
          <a href="#pricing" className="block text-sm text-zinc-400 hover:text-zinc-100">Pricing</a>
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" onClick={onSignIn} className="border-zinc-700 text-zinc-300">Sign In</Button>
            <Button onClick={onSignUp} className="bg-indigo-600 text-white hover:bg-indigo-500">Get started free</Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();
  const goSignIn = () => navigate('/auth?mode=login');
  const goSignUp = () => navigate('/auth?mode=register');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar onSignIn={goSignIn} onSignUp={goSignUp} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          <Badge className="mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            ✦ Powered by Gemini 2.5 Flash · Zero-setup resume builder
          </Badge>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl leading-[1.05]">
            Your resume,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              rewritten by AI
            </span>
            .
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-zinc-400 md:text-xl leading-relaxed">
            Upload a PDF or DOCX and NeatResume instantly parses it into a beautiful, editable resume
            with a live ATS score — ready to download in seconds.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              onClick={goSignUp}
              size="lg"
              className="group gap-2 rounded-xl bg-indigo-600 px-8 py-6 text-base font-semibold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 transition-all duration-200 hover:shadow-indigo-600/40 hover:scale-[1.02]"
            >
              Build my resume free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              onClick={goSignIn}
              variant="outline"
              size="lg"
              className="rounded-xl border-zinc-700 px-8 py-6 text-base text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Sign in
            </Button>
          </div>

          <p className="mt-5 text-xs text-zinc-600">No credit card required · Free forever plan available</p>
        </div>

        {/* Mock editor preview */}
        <div className="relative z-10 mt-16 w-full max-w-5xl">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-1 shadow-2xl shadow-black/60">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs text-zinc-600 font-mono">NeatResume — Editor</span>
            </div>
            <div className="grid grid-cols-5 gap-0 overflow-hidden rounded-b-xl" style={{ height: 320 }}>
              {/* Sidebar mock */}
              <div className="col-span-2 border-r border-zinc-800 p-4 space-y-3">
                <div className="h-4 w-3/4 rounded-full bg-zinc-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded-full bg-zinc-800/60 animate-pulse" />
                <div className="h-px bg-zinc-800 my-2" />
                {['Personal Info', 'Experience', 'Education', 'Projects', 'Skills'].map((s) => (
                  <div key={s} className="flex items-center justify-between rounded-lg bg-zinc-800/40 px-3 py-2">
                    <span className="text-xs text-zinc-500">{s}</span>
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  </div>
                ))}
              </div>
              {/* Preview mock */}
              <div className="col-span-3 bg-white p-6 overflow-hidden">
                <div className="h-5 w-36 rounded bg-indigo-200 mb-1" />
                <div className="h-3 w-24 rounded bg-zinc-200 mb-4" />
                <div className="h-px bg-zinc-200 mb-4" />
                {[80, 95, 60, 75, 90].map((w, i) => (
                  <div key={i} className="h-2.5 rounded-full bg-zinc-100 mb-2" style={{ width: `${w}%` }} />
                ))}
                <div className="mt-4 flex gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'Python'].map((t) => (
                    <span key={t} className="text-xs rounded-full border border-indigo-200 px-2 py-0.5 text-indigo-400">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow under preview */}
          <div className="pointer-events-none absolute -bottom-8 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Badge className="mb-4 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-400">
              Features
            </Badge>
            <h2 className="text-4xl font-bold text-zinc-100 md:text-5xl">
              Everything you need to{' '}
              <span className="text-indigo-400">land the job</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-zinc-500">
              NeatResume isn't just a template tool — it's a complete resume intelligence platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30`}
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/80 ${f.accent}`}>
                  {f.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-zinc-100">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 px-6 border-y border-zinc-800/50 bg-zinc-900/30">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-zinc-100">Loved by job seekers</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-3 flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-zinc-300 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="text-sm font-semibold text-zinc-100">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <Badge className="mb-4 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-400">
              Pricing
            </Badge>
            <h2 className="text-4xl font-bold text-zinc-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-zinc-500">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                  plan.highlight
                    ? 'border-indigo-500/50 bg-indigo-600/5 shadow-2xl shadow-indigo-600/10 scale-[1.02]'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white border-0">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-zinc-400 mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-extrabold text-zinc-100">{plan.price}</span>
                    <span className="text-sm text-zinc-500 mb-1.5">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{plan.desc}</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-emerald-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={goSignUp}
                  className={`w-full rounded-xl py-5 font-semibold ${
                    plan.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
                      : 'border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-indigo-600/5 px-10 py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
            <h2 className="relative mb-4 text-4xl font-extrabold text-zinc-100">
              Ready to land your dream job?
            </h2>
            <p className="relative mb-8 text-zinc-400">
              Join thousands of candidates who got hired faster with NeatResume.
            </p>
            <Button
              onClick={goSignUp}
              size="lg"
              className="group relative gap-2 rounded-xl bg-indigo-600 px-10 py-6 text-base font-semibold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30"
            >
              Start for free — no card needed
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-10 px-6">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <FileText className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-300">NeatResume</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} NeatResume. Built with ❤️ and Gemini AI.
          </p>
          <div className="flex items-center gap-4 text-zinc-600">
            <Github className="h-4 w-4 hover:text-zinc-300 cursor-pointer transition-colors" />
            <Twitter className="h-4 w-4 hover:text-zinc-300 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
