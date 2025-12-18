import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { fetchBuilds, createBuild, updateBuild, deleteBuild, onOrderUpdate } from '../../services/adminService';
import { Button } from '../Button';
import { PlusIcon, TrashIcon, SettingsIcon, LayoutIcon, XIcon, LoaderIcon } from '../Icons';

export const AdminBuilds: React.FC = () => {
  const [builds, setBuilds] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchBuilds();
    setBuilds(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = onOrderUpdate(loadData);
    return () => unsubscribe();
  }, []);

  const handleEdit = (build: Project) => {
    setFormData(build);
    setEditingId(build.id);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      category: 'SaaS',
      status: 'draft',
      image: 'https://picsum.photos/800/600'
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (editingId) {
      await updateBuild(editingId, formData);
    } else {
      await createBuild(formData);
    }
    setIsFormOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this build from portfolio?")) {
      await deleteBuild(id);
      await loadData();
    }
  };

  if (isLoading && !builds.length) return <div className="p-10 flex justify-center"><LoaderIcon className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Portfolio Builds</h2>
        <Button onClick={handleCreate} className="!py-2 !text-xs">
          <PlusIcon size={14} /> New Build
        </Button>
      </div>

      {isFormOpen ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Build' : 'New Build'}</h3>
            <button onClick={() => setIsFormOpen(false)}><XIcon className="text-zinc-500 hover:text-white" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-zinc-500 text-xs mb-2">Project Title</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.title || ''}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-zinc-500 text-xs mb-2">Category</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.category || ''}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-zinc-500 text-xs mb-2">Description</label>
              <textarea 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none h-24"
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-zinc-500 text-xs mb-2">Image URL</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.image || ''}
                onChange={e => setFormData({...formData, image: e.target.value})}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-zinc-500 text-xs mb-2">Status</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.status || 'draft'}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="live">Live (Public)</option>
              </select>
            </div>
            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId ? 'Save Changes' : 'Create Build'}</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {builds.map(build => (
            <div key={build.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                  <img src={build.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold text-sm">{build.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${build.status === 'live' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                      {build.status || 'draft'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs">{build.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(build)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                  <SettingsIcon size={16} />
                </button>
                <button onClick={() => handleDelete(build.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors">
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};