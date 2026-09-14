import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Lock, Mail, User, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';
import { useAuth, api } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FieldErrors = Partial<Record<string, string>>;

// ─── Auth Page ────────────────────────────────────────────────────────────────

const AuthPage: React.FC = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('mode') === 'register' ? 'register' : 'login'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { login, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(params.get('redirect') || '/dashboard');
  }, [isAuthenticated, navigate, params]);

  useEffect(() => {
    setMode(params.get('mode') === 'register' ? 'register' : 'login');
    setFieldErrors({});
    setServerError('');
  }, [params]);

  const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;

    const autoLogin = params.get('autoLogin');
    const autoEmail = params.get('email');
    const autoPassword = params.get('password');

    if (autoLogin === 'true' && autoEmail && autoPassword && !isAuthenticated && !hasAttemptedAutoLogin) {
      setHasAttemptedAutoLogin(true);
      const performAutoLogin = async () => {
        setLoading(true);
        try {
          const { data } = await api.post('/api/auth/login', { email: autoEmail, password: autoPassword });
          if (data.accessToken && data.user) {
            login(data.accessToken, data.user);
            navigate(params.get('redirect') || '/dashboard');
          }
        } catch (err: any) {
          setServerError('Auto-login failed. Please sign in manually.');
        } finally {
          setLoading(false);
        }
      };
      performAutoLogin();
    }
  }, [params, isAuthenticated, isInitialized, login, navigate, hasAttemptedAutoLogin]);

  const switchMode = (m: 'login' | 'register') => {
    navigate(`/auth?mode=${m}`, { replace: true });
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setFieldErrors({}); setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setFieldErrors({});

    // Client-side Zod validation
    const schema = mode === 'login' ? loginSchema : registerSchema;
    const parsed = schema.safeParse({ name, email, password, confirmPassword });
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = mode === 'register'
        ? { name, email, password }
        : { email, password };

      const { data } = await api.post(endpoint, payload);

      if (data.accessToken && data.user) {
        login(data.accessToken, data.user);
        navigate(params.get('redirect') || '/dashboard');
      }
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      if (Array.isArray(errorData)) {
        setServerError(errorData.map((e: any) => e.message).join(', '));
      } else if (typeof errorData === 'string') {
        setServerError(errorData);
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">

      {/* ─── Left Panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-indigo-950/30 to-zinc-950 border-r border-zinc-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <Link to="/" className="relative flex items-center gap-2.5 group w-fit">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <FileText className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-100">NeatResume</span>
        </Link>

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            ✦ AI Resume Intelligence
          </div>
          <h2 className="text-4xl font-extrabold text-zinc-100 leading-tight">
            Your career story,<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              beautifully told.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            Upload your resume and our AI restructures it into a polished, ATS-optimized profile with real-time editing.
          </p>
        </div>

        <div className="relative space-y-3 pt-6 border-t border-zinc-800">
          {[
            'AI-powered parsing with Gemini 2.5 Flash',
            '5 beautiful, printable templates',
            'Live ATS score as you edit',
            'Secure cloud storage — never lose your work',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="h-5 w-5 flex-shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="text-sm text-zinc-400">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right Form Panel ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-zinc-900/30">

        {/* Back to landing (mobile) */}
        <div className="absolute top-5 left-5 lg:hidden">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </div>

        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 shadow-2xl">
          <CardHeader className="pb-2">
            {/* Mobile logo */}
            <Link to="/" className="flex lg:hidden items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-zinc-100">NeatResume</span>
            </Link>

            {/* Mode tabs */}
            <div className="flex bg-zinc-950 p-1 rounded-xl mb-4 border border-zinc-800">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === m
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <CardTitle className="text-xl text-zinc-100">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </CardTitle>
            <CardDescription className="text-zinc-500 text-sm">
              {mode === 'login'
                ? 'Sign in to your NeatResume workspace.'
                : 'Start building your perfect resume today.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name — register only */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    <Input
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
                    />
                  </div>
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <Input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <Input
                    type={showPw ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Min. 6 chars, 1 uppercase, 1 number' : '••••••••'}
                    className="pl-9 pr-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>}
              </div>

              {/* Confirm Password — register only */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="pl-9 pr-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>}
                </div>
              )}

              {/* Server error */}
              {serverError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400 text-center">
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                  ? 'Please wait...'
                  : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>

              {/* Switch mode link */}
              <p className="text-center text-xs text-zinc-500">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-zinc-700">
          By continuing you agree to our{' '}
          <span className="text-zinc-600 underline underline-offset-2 cursor-pointer hover:text-zinc-400">Terms</span>
          {' '}and{' '}
          <span className="text-zinc-600 underline underline-offset-2 cursor-pointer hover:text-zinc-400">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
