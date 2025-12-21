import React, { useState } from 'react';
import { Button } from '../Button';
import { LockIcon, ArrowRightIcon } from '../Icons';
import { loginUser, getUserProfile } from '../../services/authService';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;

      // 2. Check if user is the master admin (hardcoded fallback)
      if (email === 'kevin@timace.io') {
        onLogin();
        return;
      }

      // 3. Fetch User Profile from Firestore to check Role
      const profile = await getUserProfile(user.uid);

      if (profile && profile.role === 'admin') {
        onLogin();
      } else {
        setError("Access Denied: Not an administrator.");
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-brand-500 shadow-inner">
            <LockIcon size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Studio Portal</h1>
        <p className="text-zinc-500 text-center mb-8 text-sm">Restricted Access. Authorized Personnel Only.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-200 text-sm">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
              placeholder="admin@timace.studio"
            />
          </div>
          <div>
            <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
            {isLoading ? 'Authenticating...' : 'Access Portal'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={onBack} className="text-zinc-600 hover:text-white text-xs flex items-center justify-center gap-1 mx-auto transition-colors">
            <ArrowRightIcon size={12} className="rotate-180" /> Return to Site
          </button>
        </div>
      </div>
    </div>
  );
};