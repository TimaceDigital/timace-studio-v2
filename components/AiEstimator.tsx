import React, { useState } from 'react';
import { SparklesIcon, ArrowRightIcon, LoaderIcon, CpuIcon, CheckCircleIcon } from './Icons';
import { Button } from './Button';
import { analyzeProjectIdea } from '../services/geminiService';
import { AnalysisResponse, AnalysisStatus } from '../types';

export const AiEstimator: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setStatus(AnalysisStatus.LOADING);
    try {
      const data = await analyzeProjectIdea(idea);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <section className="py-32 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brand-900/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <SparklesIcon className="text-brand-400" />
              Test Our Agentic Brain
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Not ready to order? Enter your product idea below. 
              Our AI architect will assess feasibility and stack suitability instantly.
            </p>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl ring-1 ring-white/5">
            <form onSubmit={handleAnalyze} className="relative">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your idea here... e.g., A marketplace for renting high-end cameras in Berlin..."
                className="w-full bg-zinc-950/50 text-white rounded-2xl p-6 min-h-[140px] focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all resize-none placeholder-zinc-600 font-mono text-sm leading-relaxed"
              />
              <div className="flex justify-between items-center mt-3 px-2">
                 <div className="text-xs text-zinc-600 font-mono flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Model: Gemini 2.5 Flash
                 </div>
                 <Button 
                   type="submit" 
                   disabled={status === AnalysisStatus.LOADING || !idea.trim()}
                   className="!py-2.5 !px-5 !text-xs !rounded-xl"
                 >
                   {status === AnalysisStatus.LOADING ? (
                     <><LoaderIcon className="animate-spin" size={14} /> Architecting...</>
                   ) : (
                     <><CpuIcon size={14} /> Analyze Idea</>
                   )}
                 </Button>
              </div>
            </form>
          </div>

          {status === AnalysisStatus.ERROR && (
             <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm text-center">
               Could not connect to the Agentic Brain. Please ensure the API Key is configured.
             </div>
          )}

          {status === AnalysisStatus.SUCCESS && result && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <div className="bg-zinc-900/60 border border-white/5 p-8 rounded-2xl hover:border-brand-500/20 transition-colors">
                <div className="flex items-center gap-2 text-brand-400 mb-6 text-xs font-mono uppercase tracking-wider">
                   <CpuIcon size={14} /> Structural Analysis
                </div>
                <div className="space-y-6">
                  <div>
                    <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">Feasibility</span>
                    <p className="text-white text-lg font-medium">{result.feasibility}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-1">Estimated Timeline</span>
                    <p className="text-white text-lg font-medium">{result.estimatedTimeline}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-white/5 p-8 rounded-2xl hover:border-purple-500/20 transition-colors">
                 <div className="flex items-center gap-2 text-purple-400 mb-6 text-xs font-mono uppercase tracking-wider">
                   <SparklesIcon size={14} /> Agentic Insight
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                  "{result.agenticInsight}"
                </p>
                <div className="pt-6 border-t border-white/5">
                   <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">Recommended Stack</span>
                   <p className="text-brand-200 font-mono text-xs">{result.stackRecommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};