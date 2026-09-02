import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../context/AuthContext';

// ─── Upload Step States ────────────────────────────────────────────────────

type UploadStep = 'idle' | 'uploading' | 'extracting' | 'structuring' | 'saving' | 'done' | 'error';

const STEPS: { key: UploadStep; label: string }[] = [
  { key: 'uploading', label: 'Uploading file...' },
  { key: 'extracting', label: 'Extracting text...' },
  { key: 'structuring', label: 'Structuring with AI...' },
  { key: 'saving', label: 'Saving to your account...' },
  { key: 'done', label: 'Done!' },
];

const STEP_KEYS = STEPS.map((s) => s.key);

function stepProgress(step: UploadStep): number {
  const idx = STEP_KEYS.indexOf(step);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / STEPS.length) * 100);
}

// ─── Drop Zone ─────────────────────────────────────────────────────────────

function DropZone({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-16 px-8 cursor-pointer transition-all duration-200 ${
        dragging
          ? 'border-indigo-500 bg-indigo-600/10 scale-[1.01]'
          : 'border-zinc-700 bg-zinc-900 hover:border-indigo-600/50 hover:bg-zinc-800/50'
      }`}
    >
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${
        dragging ? 'bg-indigo-600/20' : 'bg-zinc-800'
      }`}>
        <Upload className={`h-8 w-8 transition-colors ${dragging ? 'text-indigo-400' : 'text-zinc-500'}`} />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-zinc-200">
          Drop your resume here, or{' '}
          <span className="text-indigo-400 hover:text-indigo-300">browse</span>
        </p>
        <p className="mt-1 text-sm text-zinc-500">PDF or DOCX · Max 5MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="sr-only"
        onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }}
      />
    </div>
  );
}

// ─── Progress UI ───────────────────────────────────────────────────────────

function ProgressView({
  step,
  fileName,
  error,
  onRetry,
}: {
  step: UploadStep;
  fileName: string;
  error: string;
  onRetry: () => void;
}) {
  const progress = stepProgress(step);
  const isError = step === 'error';
  const isDone = step === 'done';

  return (
    <div className="flex flex-col gap-6">
      {/* File pill */}
      <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10">
          <FileText className="h-5 w-5 text-indigo-400" />
        </div>
        <span className="flex-1 truncate text-sm font-medium text-zinc-200">{fileName}</span>
        {isDone && <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />}
        {isError && <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />}
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-400 mb-3">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{isDone ? 'Complete!' : STEPS.find((s) => s.key === step)?.label}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step checklist */}
          <div className="space-y-2">
            {STEPS.filter((s) => s.key !== 'done').map((s) => {
              const sIdx = STEP_KEYS.indexOf(s.key);
              const cIdx = STEP_KEYS.indexOf(step);
              const completed = sIdx < cIdx || isDone;
              const active = sIdx === cIdx && !isDone;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    completed ? 'bg-emerald-500/20' : active ? 'bg-indigo-600/20' : 'bg-zinc-800'
                  }`}>
                    {completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : active ? (
                      <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${
                    completed ? 'text-zinc-400' : active ? 'text-zinc-200 font-medium' : 'text-zinc-600'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function UploadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<UploadStep>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const runPipeline = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setError('');
    setStep('uploading');

    try {
      // Short artificial delay so each step is visible
      await new Promise((r) => setTimeout(r, 400));
      setStep('extracting');
      await new Promise((r) => setTimeout(r, 300));
      setStep('structuring');

      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data } = await api.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStep('saving');
      await new Promise((r) => setTimeout(r, 300));
      setStep('done');

      // Redirect after a brief success moment
      setTimeout(() => {
        navigate(`/resumes/${data.resume.id}/edit`);
      }, 800);
    } catch (err: any) {
      const data = err.response?.data;
      if (!data) {
        setError(err.message || 'Something went wrong. Please try again.');
        setStep('error');
        return;
      }
      
      let errorName = data.error || 'Upload error';
      let errorMsg = '';
      
      if (typeof data.details === 'string') {
        errorMsg = data.details;
      } else if (typeof data.details === 'object' && data.details !== null) {
        // Handle FastAPI detail object
        const pyDetail = data.details.detail;
        if (typeof pyDetail === 'string') {
          errorMsg = pyDetail;
        } else if (typeof pyDetail === 'object' && pyDetail !== null) {
          if (pyDetail.error && pyDetail.details) {
            errorName = pyDetail.error;
            errorMsg = pyDetail.details;
          } else {
            errorMsg = JSON.stringify(pyDetail);
          }
        } else {
          errorMsg = JSON.stringify(data.details);
        }
      }
      
      setError(`${errorName}: ${errorMsg || 'Unknown error'}`);
      setStep('error');
    }
  }, [navigate]);

  const handleFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      setFile(f);
      setError('File is too large. Maximum size is 5MB.');
      setStep('error');
      return;
    }
    runPipeline(f);
  };

  const handleReset = () => {
    setStep('idle');
    setFile(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-100">Upload Resume</h1>
            <p className="mt-1 text-sm text-zinc-500">
              AI will parse your resume into a structured, editable profile.
            </p>
          </div>

          {step === 'idle' ? (
            <DropZone onFile={handleFile} />
          ) : (
            <ProgressView
              step={step}
              fileName={file?.name ?? ''}
              error={error}
              onRetry={handleReset}
            />
          )}

          {step === 'idle' && (
            <p className="mt-4 text-center text-xs text-zinc-600">
              Your file is processed securely and never stored permanently.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
