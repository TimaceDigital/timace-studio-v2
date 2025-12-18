import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { ArrowUpRightIcon, LoaderIcon } from './Icons';
import { getAllBuilds } from '../services/authService';

export const Builds: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getAllBuilds();
    // Filter only live projects
    setProjects(data.filter(p => p.status !== 'draft'));
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen pt-48 flex justify-center"><LoaderIcon className="animate-spin text-zinc-600" /></div>;

  return (
    <div className="pt-48 pb-16 min-h-screen">
       <div className="container mx-auto px-6">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Latest Builds</h1>
            <p className="text-zinc-400 max-w-2xl text-lg">
              Explore our latest shipping manifest. Each project here was built using the Timace workflow: 
              Human Vision + Agentic Execution.
            </p>
          </div>

          {projects.length === 0 ? (
             <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
               No live builds to display currently.
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="group relative rounded-xl overflow-hidden aspect-[16/10] bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-all duration-500 scale-100 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                  />
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-brand-400 text-xs font-mono uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded">
                          {project.category}
                        </span>
                        <div className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                          <ArrowUpRightIcon size={16} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-zinc-400 text-sm max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
       </div>
    </div>
  );
};