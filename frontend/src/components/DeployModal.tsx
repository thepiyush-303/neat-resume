import { useState } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api } from '../context/AuthContext';

export function DeployModal({
  isOpen,
  onClose,
  resumeId,
  templateId,
  onDeployed,
}: {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  templateId?: string;
  onDeployed: (url: string) => void;
}) {
  const [repoName, setRepoName] = useState('neatresume-portfolio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeploy = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/portfolio/deploy', { resumeId, repoName, templateId });
      onDeployed(data.url);
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Deployment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10">
            <Globe className="h-5 w-5 text-indigo-400" />
          </div>
          <DialogTitle className="text-zinc-100">Deploy Portfolio</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Publish your resume as a live website via GitHub Pages.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              GitHub Repository Name
            </label>
            <Input
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-600"
              placeholder="e.g. my-portfolio"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              We'll create a public repository in your connected GitHub account to host the site.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={loading || !repoName.trim()}
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Deploying…</>
              ) : (
                <><Globe className="h-4 w-4" /> Deploy to GitHub</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
