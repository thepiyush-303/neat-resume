import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000';

const AuthPage: React.FC = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);
  useEffect(() => { setMode(params.get('mode') === 'register' ? 'register' : 'login'); }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(`${API}${endpoint}`, { email, password });
      if (data.success) {
        login(data.token, data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a30 100%)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)' }} />
        <Link to="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">NeatResume</span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Your career story,<br />
            <span className="gradient-text">beautifully told.</span>
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
            Upload once. Preview 5 designs.<br />Share the perfect portfolio.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative space-y-4">
          {['AI-powered resume parsing', '5 production-ready templates', 'JWT secured & private'].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-brand-light)' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">NeatResume</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {mode === 'login' ? 'Sign in to your portfolio workspace.' : 'Start building your dream portfolio today.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'var(--color-surface)' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
                style={mode === m
                  ? { background: 'var(--color-brand)', color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }
                  : { color: 'var(--color-text-muted)' }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Email address</label>
              <input id="auth-email" type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-brand)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Password</label>
              <div className="relative">
                <input id="auth-password" type={showPw ? 'text' : 'password'} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-brand)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                  style={{ color: 'var(--color-text-faint)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <button id="auth-submit" type="submit" disabled={loading}
              className="w-full py-3.5 font-bold text-white rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', marginTop: '8px' }}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
