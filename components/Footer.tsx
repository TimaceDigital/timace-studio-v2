import React from 'react';
import { TwitterIcon, GithubIcon, LinkedinIcon, LockIcon } from './Icons';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Timace Studio v2</h3>
            <p className="text-zinc-500 max-w-xs text-sm leading-relaxed mb-6">
              Async productized development studio.
              Idea to prototype in 1 hour.
              Human vision, agentic execution.
            </p>
            <div className="flex gap-4">
               <a href="#" className="text-zinc-600 hover:text-white transition-colors"><TwitterIcon size={20} /></a>
               <a href="#" className="text-zinc-600 hover:text-white transition-colors"><GithubIcon size={20} /></a>
               <a href="#" className="text-zinc-600 hover:text-white transition-colors"><LinkedinIcon size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">App Prototypes</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Consultancy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Maintenance</a></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">System</h4>
             <ul className="space-y-3 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Client Dashboard</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Documentation</a></li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Status: Operational
              </li>
             </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Timace Studio. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
             <a href="#" className="hover:text-zinc-400">Privacy</a>
             <a href="#" className="hover:text-zinc-400">Terms</a>
             {onAdminClick && (
               <button onClick={onAdminClick} className="hover:text-white flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                 <LockIcon size={10} /> Admin
               </button>
             )}
          </div>
        </div>
      </div>
    </footer>
  );
};