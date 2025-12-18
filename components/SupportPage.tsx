import React, { useState } from 'react';
import { Button } from './Button';
import { CheckCircleIcon, FileTextIcon, BellIcon } from './Icons';

export const SupportPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => setSubmitted(true), 1000);
  };

  if (submitted) {
    return (
      <div className="pt-48 pb-20 min-h-screen container mx-auto px-6 flex items-center justify-center">
        <div className="bg-zinc-900/50 border border-green-500/30 p-12 rounded-3xl text-center max-w-lg">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircleIcon size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ticket Received</h2>
          <p className="text-zinc-400 mb-8">
            Your request has been logged in our system. Reference ID: <span className="font-mono text-white">#TKT-{Math.floor(Math.random()*10000)}</span>. 
            <br/>Our team will review it and respond asynchronously within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-48 pb-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <span className="text-brand-500 font-mono text-xs uppercase tracking-widest mb-2 block">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Submit a Ticket</h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            Detailed issues require detailed solutions. Fill out the form below and our engineering team will pick it up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Full Name</label>
                  <input type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Email Address</label>
                  <input type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors" placeholder="jane@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Issue Type</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors appearance-none">
                  <option>Technical Issue</option>
                  <option>Billing Question</option>
                  <option>Project Update Request</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Description</label>
                <textarea required rows={6} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-500/50 focus:outline-none transition-colors resize-none" placeholder="Please describe the issue in detail..." />
              </div>

              <div>
                <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer">
                  <FileTextIcon className="mx-auto text-zinc-600 mb-2" />
                  <span className="text-zinc-500 text-sm">Drag & drop files or click to browse</span>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" fullWidth>Submit Request</Button>
              </div>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <BellIcon size={18} className="text-brand-400" /> Response Times
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between">
                  <span className="text-zinc-400">Critical</span>
                  <span className="text-white font-mono">&lt; 1 Hour</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Standard</span>
                  <span className="text-white font-mono">&lt; 24 Hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-400">Billing</span>
                  <span className="text-white font-mono">&lt; 48 Hours</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2">Direct Email</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Prefer email? Reach out directly to our support inbox.
              </p>
              <a href="mailto:support@timace.studio" className="text-brand-400 hover:text-brand-300 font-mono text-sm">support@timace.studio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};