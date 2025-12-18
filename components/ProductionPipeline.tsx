import React from 'react';
import { 
  SparklesIcon, GitBranchIcon, TerminalIcon, 
  DatabaseIcon, CloudLightningIcon, CheckCircleIcon 
} from './Icons';

export const ProductionPipeline: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Agentic Ideation",
      subtitle: "Prototyping",
      description: "We scaffold the core logic in minutes using Gemini 3 Pro and Claude 3.5 Sonnet to translate your raw vision into structural code.",
      icon: <SparklesIcon className="text-purple-400" size={24} />,
      tools: ["Gemini 3 Pro", "Claude Sonnet", "AI Studio"]
    },
    {
      id: "02",
      title: "Git-Based Ownership",
      subtitle: "Version Control",
      description: "Every line of code is committed to a private GitHub repository that you own from day one. No black boxes.",
      icon: <GitBranchIcon className="text-orange-400" size={24} />,
      tools: ["GitHub", "Private Repo", "CI/CD"]
    },
    {
      id: "03",
      title: "Hybrid Engineering",
      subtitle: "Development",
      description: "We use Cursor fueled by next-gen models (Claude 3.5 Opus, Gemini 3 Pro+) to flash-weld the frontend while integrating robust backends.",
      icon: <TerminalIcon className="text-blue-400" size={24} />,
      tools: ["Cursor", "Claude Opus 4.5", "React/Next.js"]
    },
    {
      id: "04",
      title: "Persistent Data",
      subtitle: "Backend",
      description: "Scalable database architecture using Supabase (PostgreSQL) or Firebase. Built to handle 10 or 10,000 users.",
      icon: <DatabaseIcon className="text-emerald-400" size={24} />,
      tools: ["Supabase", "Firebase", "PostgreSQL"]
    },
    {
      id: "05",
      title: "Edge Delivery",
      subtitle: "Deployment",
      description: "Serverless hosting via Google Cloud Run with global CDN and security layer provided by Cloudflare.",
      icon: <CloudLightningIcon className="text-amber-400" size={24} />,
      tools: ["Google Cloud Run", "Cloudflare", "Global CDN"]
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      {/* Connector Line Background */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent hidden md:block"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-500 font-mono text-xs uppercase tracking-widest mb-3 block">Under The Hood</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Production Pipeline</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            We don't hide our stack. This is the exact high-performance architecture we use 
            to deliver robust applications in record time.
          </p>
        </div>

        <div className="space-y-12 relative">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Text Side */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <div className={`inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-500 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <span>Phase {step.id}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span>{step.subtitle}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                <div className={`flex gap-2 flex-wrap ${index % 2 === 0 ? 'justify-start' : 'justify-start md:justify-end'}`}>
                   {step.tools.map(tool => (
                     <span key={tool} className="px-2 py-1 bg-zinc-900/50 border border-zinc-800 rounded text-[10px] text-zinc-500 font-mono">
                       {tool}
                     </span>
                   ))}
                </div>
              </div>

              {/* Icon/Center Node */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:scale-110 transition-transform duration-300 hover:border-zinc-600">
                  {step.icon}
                </div>
                {/* Mobile connector line */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-zinc-800 md:hidden"></div>
                )}
              </div>

              {/* Spacer Side */}
              <div className="flex-1 hidden md:block"></div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};