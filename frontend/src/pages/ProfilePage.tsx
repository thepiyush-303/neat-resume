import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, Loader2, Link as LinkIcon, User, MapPin, Briefcase } from 'lucide-react';
import { api, useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    photoBase64: user?.photoBase64 || '',
    jobTitle: '',
    bio: '',
    location: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    twitterUrl: '',
    githubUrl: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/user/profile');
        setFormData({
          name: data.name || '',
          photoBase64: data.profile?.photoBase64 || '',
          jobTitle: data.profile?.jobTitle || '',
          bio: data.profile?.bio || '',
          location: data.profile?.location || '',
          phone: data.profile?.phone || '',
          linkedinUrl: data.profile?.linkedinUrl || '',
          portfolioUrl: data.profile?.portfolioUrl || '',
          twitterUrl: data.profile?.twitterUrl || '',
          githubUrl: data.profile?.githubUrl || '',
        });
        
        if (data.profile?.photoBase64) {
          updateUser({ photoBase64: data.profile.photoBase64 });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Resize and compress with Canvas to avoid huge payloads
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({ ...prev, photoBase64: dataUrl }));
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.put('/api/user/profile', formData);
      setSuccess(true);
      updateUser({ 
        name: res.data.name,
        photoBase64: res.data.profile.photoBase64 
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Profile Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your public profile and global preferences.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="h-28 w-28 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center border-4 border-zinc-950 shadow-xl">
            {formData.photoBase64 ? (
              <img src={formData.photoBase64} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-zinc-500" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 border-2 border-zinc-950 flex items-center justify-center text-white hover:bg-indigo-500 transition shadow-lg opacity-90 group-hover:opacity-100"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-zinc-100">Profile Picture</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">We recommend an image of at least 400x400px. It will be compressed automatically.</p>
          {formData.photoBase64 && (
            <button onClick={() => setFormData({ ...formData, photoBase64: '' })} className="mt-3 text-sm text-red-400 hover:text-red-300 font-medium">
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2 h-4 w-4 text-zinc-500" />
              <Input 
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} 
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2 h-4 w-4 text-zinc-500" />
              <Input 
                value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} 
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="e.g. Software Engineer"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-medium text-zinc-400">Bio</label>
            <textarea 
              value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} 
              rows={3}
              placeholder="A short biography..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500 outline-none resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1.5 h-4 w-4 text-zinc-500" />
              <Input 
                value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} 
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="e.g. San Francisco, CA"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Phone</label>
            <Input 
              value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              className="bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mt-6 space-y-6">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-2">
          <LinkIcon className="h-4 w-4 text-indigo-400" />
          Social & Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">LinkedIn URL</label>
            <Input 
              value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} 
              className="bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">GitHub URL</label>
            <Input 
              value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} 
              className="bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Portfolio Website</label>
            <Input 
              value={formData.portfolioUrl} onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })} 
              className="bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">X (Twitter) URL</label>
            <Input 
              value={formData.twitterUrl} onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })} 
              className="bg-zinc-950 border-zinc-800 text-zinc-100" placeholder="https://twitter.com/..."
            />
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex items-center justify-end mt-8 gap-4 pb-12">
        {success && <span className="text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-right-4">Profile saved successfully!</span>}
        <Button onClick={handleSave} disabled={saving || !formData.name.trim()} className="bg-indigo-600 hover:bg-indigo-500 w-32">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Profile</>}
        </Button>
      </div>
    </div>
  );
}
