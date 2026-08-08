import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud, FileText, X, Sparkles, LogOut,
  Loader2, CheckCircle, AlertCircle, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import type { PortfolioData } from '../context/PortfolioContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'error';

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { setPortfolioData } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported.');
      setStatus('error');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be under 5MB.');
      setStatus('error');
      return;
    }
    setFile(f);
    setStatus('idle');
    setErrorMsg('');
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');
    // Clear any stale data from a previous upload
    setPortfolioData(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const uploadRes = await axios.post(`${API}/api/resume/upload`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!uploadRes.data.success) throw new Error(uploadRes.data.message);
      const rawText: string = uploadRes.data.data.extractedText;

      setStatus('parsing');
      const llmRes = await axios.post(
        `${API}/api/format/llm`,
        { rawText },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!llmRes.data.success) throw new Error(llmRes.data.message);
      setPortfolioData(llmRes.data.data as PortfolioData);
      setStatus('success');
      // Navigate immediately — data is already in context
      navigate('/templates');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Upload failed. Check your connection.');
      setStatus('error');
    }
  };

  const statusMessages: Record<UploadStatus, string> = {
    idle: '',
    uploading: 'Sending to parser service...',
    parsing: 'Gemini AI is extracting your data...',
    success: 'Done! Redirecting to templates...',
    error: errorMsg,
  };

  const isLoading = status === 'uploading' || status === 'parsing';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* Top Nav */}
      <header
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              NeatResume
            </span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* User email */}
            <span
              className="text-sm hidden md:block px-3 py-1.5 rounded-lg"
              style={{
                color: 'var(--color-text-muted)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              {user?.email}
            </span>

            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" style={{ color: '#f59e0b' }} />
                : <Moon className="w-4 h-4" style={{ color: '#6366f1' }} />
              }
            </button>

            {/* Logout */}
            <button
              id="logout-btn"
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl animate-fade-up">

          {/* Heading */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'var(--color-brand-muted)',
                color: 'var(--color-brand-light)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <Sparkles className="w-3 h-3" />
              Powered by Gemini AI
            </div>
            <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--color-text)' }}>
              Upload Your Resume
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-base leading-relaxed">
              Drop your PDF and watch our AI transform it into a stunning portfolio in seconds.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            id="drop-zone"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className="relative flex flex-col items-center justify-center p-10 rounded-3xl cursor-pointer transition-all duration-300"
            style={{
              border: `2px dashed ${isDragging ? 'var(--color-brand)' : file ? 'var(--color-success)' : 'var(--color-border)'}`,
              background: isDragging
                ? 'rgba(99,102,241,0.05)'
                : file
                  ? theme === 'dark' ? 'rgba(34,197,94,0.04)' : 'rgba(34,197,94,0.06)'
                  : 'var(--color-surface)',
              boxShadow: isDragging ? '0 0 30px rgba(99,102,241,0.15)' : 'var(--shadow-card)',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />

            {file ? (
              <>
                <div
                  className="w-18 h-18 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    width: 72, height: 72,
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.25)',
                  }}
                >
                  <FileText className="w-9 h-9" style={{ color: 'var(--color-success)' }} />
                </div>
                <p className="font-bold text-lg mb-1 truncate max-w-xs" style={{ color: 'var(--color-text)' }}>
                  {file.name}
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
                  {(file.size / 1024).toFixed(1)} KB · PDF
                </p>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null); setStatus('idle'); setErrorMsg(''); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.25)',
                  }}
                >
                  <X className="w-3.5 h-3.5" /> Remove file
                </button>
              </>
            ) : (
              <>
                <div
                  className="mb-5 animate-float"
                  style={{
                    width: 72, height: 72,
                    borderRadius: 20,
                    background: 'var(--color-brand-muted)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <UploadCloud className="w-9 h-9" style={{ color: 'var(--color-brand-light)' }} />
                </div>
                <p className="font-bold text-lg mb-1.5" style={{ color: 'var(--color-text)' }}>
                  Drop your resume here
                </p>
                <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  or{' '}
                  <span style={{ color: 'var(--color-brand-light)', fontWeight: 600 }}>click to browse</span>
                  {' '}— PDF only, max 5MB
                </p>
                <div
                  className="mt-6 flex items-center gap-6 text-xs"
                  style={{ color: 'var(--color-text-faint)' }}
                >
                  {['Instant extraction', 'AI-powered', 'Private & secure'].map(t => (
                    <span key={t} className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" style={{ color: 'var(--color-success)' }} />
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Message */}
          {status !== 'idle' && (
            <div
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium animate-fade-in"
              style={{
                background: status === 'error'
                  ? 'rgba(239,68,68,0.08)'
                  : status === 'success'
                    ? 'rgba(34,197,94,0.08)'
                    : 'rgba(99,102,241,0.08)',
                border: `1px solid ${
                  status === 'error'
                    ? 'rgba(239,68,68,0.2)'
                    : status === 'success'
                      ? 'rgba(34,197,94,0.2)'
                      : 'rgba(99,102,241,0.2)'
                }`,
                color: status === 'error' ? '#f87171' : status === 'success' ? '#4ade80' : 'var(--color-brand-light)',
              }}
            >
              {status === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {status === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
              {isLoading && <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />}
              <span>{statusMessages[status]}</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            id="upload-btn"
            onClick={handleUpload}
            disabled={!file || isLoading || status === 'success'}
            className="w-full mt-5 py-4 font-bold text-white rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2.5 text-base"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: (!file || isLoading || status === 'success')
                ? 'none'
                : '0 4px 24px rgba(99,102,241,0.4)',
            }}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-5 h-5" />}
            {!isLoading && status !== 'success' && <Sparkles className="w-5 h-5" />}
            {status === 'uploading'
              ? 'Uploading...'
              : status === 'parsing'
                ? 'Parsing with AI...'
                : status === 'success'
                  ? 'Done! Redirecting...'
                  : 'Extract & Build Portfolio'}
          </button>

          {/* Bottom hint */}
          <p className="text-center text-xs mt-4" style={{ color: 'var(--color-text-faint)' }}>
            Your data is processed privately and never stored without your consent.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
