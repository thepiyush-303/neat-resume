import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { BentoGridTemplate } from '../components/templates/BentoGridTemplate';
import { TerminalTemplate } from '../components/templates/TerminalTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { CorporateTemplate } from '../components/templates/CorporateTemplate';
import {
  Layout, Grid3x3, Terminal, Palette, Building2,
  ArrowLeft, Menu, X, Sun, Moon, Sparkles,
} from 'lucide-react';

type TemplateId = 'minimalist' | 'bento' | 'terminal' | 'creative' | 'corporate';

// ── Error Boundary ─────────────────────────────────────────────────────────
class TemplateBoundary extends Component<
  { children: React.ReactNode; templateId: string },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidUpdate(prev: { templateId: string }) {
    if (prev.templateId !== this.props.templateId) this.setState({ hasError: false });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-4" style={{ color: '#9ca3af' }}>
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p className="text-sm font-medium">Failed to render this template.</p>
          <p className="text-xs">Some data from your resume may be missing or malformed.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const TEMPLATES: {
  id: TemplateId;
  name: string;
  desc: string;
  icon: React.FC<any>;
  tag: string;
  tagColor: string;
}[] = [
  {
    id: 'minimalist', name: 'Minimalist',
    desc: 'Clean, whitespace-focused single column.',
    icon: Layout, tag: 'Light',
    tagColor: 'rgba(251,191,36,0.15)',
  },
  {
    id: 'bento', name: 'Bento Grid',
    desc: 'Trendy boxed CSS grid layout.',
    icon: Grid3x3, tag: 'Trending',
    tagColor: 'rgba(99,102,241,0.15)',
  },
  {
    id: 'terminal', name: 'Terminal',
    desc: 'Dark mode, command-line inspired.',
    icon: Terminal, tag: 'Dark',
    tagColor: 'rgba(34,197,94,0.15)',
  },
  {
    id: 'creative', name: 'Creative',
    desc: 'Asymmetric dark-mode with sidebar.',
    icon: Palette, tag: 'Dark',
    tagColor: 'rgba(236,72,153,0.15)',
  },
  {
    id: 'corporate', name: 'Corporate',
    desc: 'Professional two-column layout.',
    icon: Building2, tag: 'Light',
    tagColor: 'rgba(14,165,233,0.15)',
  },
];

const renderTemplate = (id: TemplateId) => {
  switch (id) {
    case 'minimalist': return <MinimalistTemplate />;
    case 'bento':      return <BentoGridTemplate />;
    case 'terminal':   return <TerminalTemplate />;
    case 'creative':   return <CreativeTemplate />;
    case 'corporate':  return <CorporateTemplate />;
  }
};

export const TemplateSelection: React.FC = () => {
  const { portfolioData } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [active, setActive] = useState<TemplateId>('minimalist');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Empty state ─────────────────────────────────────────────────────
  if (!portfolioData) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Theme toggle in corner */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-110"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: '#f59e0b' }} /> : <Moon className="w-4 h-4" style={{ color: '#6366f1' }} />}
        </button>

        <div
          className="glass rounded-3xl p-12 max-w-md w-full text-center animate-fade-up"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--color-brand-muted)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <Layout className="w-10 h-10" style={{ color: 'var(--color-brand-light)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            No Portfolio Data Yet
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Upload your resume on the dashboard first — our AI will extract every detail instantly.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-xl transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Main view ────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:relative z-40 flex flex-col h-full w-72 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Live Preview</h1>
              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>Choose a template</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              id="theme-toggle-sidebar"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              {theme === 'dark'
                ? <Sun className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                : <Moon className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
              }
            </button>
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User info pill */}
        {portfolioData?.personalInfo && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}
              >
                {portfolioData.personalInfo.name?.charAt(0) || '?'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                  {portfolioData.personalInfo.name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                  {portfolioData.personalInfo.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Template list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {TEMPLATES.map(t => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                id={`template-${t.id}`}
                onClick={() => { setActive(t.id); setSidebarOpen(false); }}
                className="w-full text-left p-4 rounded-2xl transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.35)' : 'var(--color-border)'}`,
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
                  if (!isActive) e.currentTarget.style.background = 'var(--color-surface-2)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border)';
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: isActive ? 'rgba(99,102,241,0.2)' : 'var(--color-surface-3)',
                    }}
                  >
                    <t.icon
                      className="w-4 h-4"
                      style={{ color: isActive ? 'var(--color-brand-light)' : 'var(--color-text-muted)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: isActive ? 'var(--color-brand-light)' : 'var(--color-text)' }}
                      >
                        {t.name}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                        style={{ background: t.tagColor, color: 'var(--color-text-muted)' }}
                      >
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: 'var(--color-text-muted)' }}>
                      {t.desc}
                    </p>
                  </div>
                  {isActive && (
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: 'var(--color-brand)' }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Back to Dashboard */}
        <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </aside>

      {/* ── Canvas ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Browser chrome bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Traffic lights */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.6)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(251,191,36,0.6)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.6)' }} />
          </div>

          {/* URL bar */}
          <div
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            🔒 neatresume.app/portfolio/preview/{active}
          </div>

          {/* Active template badge */}
          <span
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: 'var(--color-brand-muted)',
              color: 'var(--color-brand-light)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            {TEMPLATES.find(t => t.id === active)?.name}
          </span>
        </div>

        {/* Preview pane */}
        <div
          className="flex-1 overflow-auto p-4 md:p-6"
          style={{
            background: theme === 'dark'
              ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.01) 10px, rgba(255,255,255,0.01) 11px)'
              : 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 11px)',
          }}
        >
          <div
            className="w-full min-h-full bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 custom-scrollbar"
            style={{ border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="overflow-auto">
              <TemplateBoundary templateId={active}>
                {renderTemplate(active)}
              </TemplateBoundary>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
