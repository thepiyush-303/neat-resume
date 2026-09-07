import { useState } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '../context/AuthContext';

export function DeployModal({ 
  isOpen, 
  onClose, 
  resumeId, 
  onDeployed 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  resumeId: string;
  onDeployed: (url: string) => void;
}) {
  const [repoName, setRepoName] = useState('neatresume-portfolio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDeploy = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/portfolio/deploy', { resumeId, repoName });
      onDeployed(data.url);
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10">
            <Globe className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Deploy Portfolio</h3>
            <p className="text-xs text-zinc-400">Publish your resume as a live website</p>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">GitHub Repository Name</label>
            <Input 
              value={repoName} 
              onChange={e => setRepoName(e.target.value)} 
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
              placeholder="e.g. my-portfolio"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              We'll create a public repository in your connected GitHub account to host the site via GitHub Pages.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-800 hover:text-white transition-colors">
            Cancel
          </Button>
          <Button onClick={handleDeploy} disabled={loading || !repoName.trim()} className="bg-indigo-600 text-white hover:bg-indigo-500 gap-2 transition-colors">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            {loading ? 'Deploying...' : 'Deploy to GitHub'}
          </Button>
        </div>
      </div>
    </div>
  );
}
