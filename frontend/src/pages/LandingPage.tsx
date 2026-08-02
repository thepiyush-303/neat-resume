import React from 'react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, Layers, ArrowRight } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Instant Extraction', desc: 'Upload a PDF — Gemini AI parses every field in seconds.' },
  { icon: Layers, title: '5 Unique Templates', desc: 'From minimalist to bento grid, pick a design that matches your vibe.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your resume data is encrypted and never stored without your consent.' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">NeatResume</span>
        </div>
        <div className="flex items-center gap-3">
          <button id="nav-signin"
            onClick={() => navigate('/auth?mode=login')}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            Sign In
          </button>
          <button id="nav-signup"
            onClick={() => navigate('/auth?mode=register')}
            className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-up"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa', animationDelay: '0.1s' }}>
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 2.5 Flash
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8 animate-fade-up"
          style={{ animationDelay: '0.2s' }}>
          <span className="text-white">Your Resume,</span><br />
          <span className="gradient-text">Beautifully Rebuilt</span>
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 animate-fade-up"
          style={{ color: 'var(--color-text-muted)', animationDelay: '0.3s', lineHeight: 1.6 }}>
          Upload your PDF. Our AI extracts every detail and renders it across 5 stunning portfolio designs — instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button id="hero-cta-primary"
            onClick={() => navigate('/auth?mode=register')}
            className="group flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }}>
            Build My Portfolio Free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button id="hero-cta-secondary"
            onClick={() => window.open('https://github.com/thepiyush-303/neat-resume', '_blank')}
            className="flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl transition-all hover:scale-105"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
            <GithubIcon className="w-5 h-5" />
            View on GitHub
          </button>
        </div>

        {/* Mock UI preview */}
        <div className="relative mt-24 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(56,189,248,0.1))', filter: 'blur(40px)' }} />
          <div className="relative rounded-3xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="mx-auto flex items-center gap-2 px-4 py-1 rounded-md text-xs" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                🔒 neatresume.app/portfolio/preview
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">✨</div>
                <p className="font-semibold text-white">Your portfolio renders here</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Upload a resume to see the magic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to stand out</h2>
          <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>Built for developers who deserve a portfolio that matches their skills.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="glass rounded-2xl p-8 transition-all group hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s`, transitionDuration: '300ms' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'var(--color-brand-muted)' }}>
                <feature.icon className="w-6 h-6" style={{ color: 'var(--color-brand-light)' }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="glass rounded-3xl p-12"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(56,189,248,0.05))' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to impress recruiters?</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>Join thousands of developers who built their portfolio in under 2 minutes.</p>
          <button id="footer-cta"
            onClick={() => navigate('/auth?mode=register')}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
