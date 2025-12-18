import React, { useState } from 'react';
import { Button } from './Button';
import { LockIcon, ArrowRightIcon, UserIcon, MailIcon, CheckCircleIcon } from './Icons';
import { login, register } from '../services/authService';
import { AuthSession } from '../types';

interface ClientLoginProps {
  onLoginSuccess: (session: AuthSession) => void;
  onBack: () => void;
}

export const ClientLogin: React.FC<ClientLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let session;
      if (isLogin) {
        session = await login(formData.email, formData.password);
      } else {
        session = await register(formData.name, formData.email, formData.password);
      }
      onLoginSuccess(session);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center text-brand-500 shadow-inner">
            <UserIcon size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-zinc-500 text-center mb-8 text-sm">
          {isLogin ? 'Access your dashboard and project builds.' : 'Start building your products asynchronously.'}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
               <label className="block text-zinc-500 text-xs uppercase font-bold mb-2 ml-1">Full Name</label>
               <div className="relative">
                 <UserIcon size={16} className="absolute left-4 top-3.5 text-zinc-600" />
                 <input 
                   type="text" 
                   required
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
                   placeholder="John Doe"
                 />
               </div>
            </div>
          )}
          
          <div className="relative">
            <label className="block text-zinc-500 text-xs uppercase font-bold mb-2 ml-1">Email Address</label>
            <div className="relative">
              <MailIcon size={16} className="absolute left-4 top-3.5 text-zinc-600" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-zinc-500 text-xs uppercase font-bold mb-2 ml-1">Password</label>
            <div className="relative">
              <LockIcon size={16} className="absolute left-4 top-3.5 text-zinc-600" />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors"
                placeholder="••••••••••••"
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="ml-2 text-brand-400 hover:text-brand-300 font-bold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onBack} className="text-zinc-600 hover:text-white text-xs flex items-center justify-center gap-1 mx-auto transition-colors group">
            <ArrowRightIcon size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Return to Site
          </button>
        </div>
      </div>
    </div>
  );
};