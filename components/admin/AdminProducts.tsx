import React, { useState, useEffect } from 'react';
import { ProductItem } from '../../types';
import { getAllProductsAdmin, addProduct, updateProduct as updateProductService, deleteProduct as deleteProductService } from '../../services/authService';
import { Button } from '../Button';
import { PlusIcon, TrashIcon, SettingsIcon, ShoppingBagIcon, CheckCircleIcon, XIcon, LoaderIcon, UploadIcon } from '../Icons';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ProductItem>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Subscribe to all products (admin view)
    const unsubscribe = getAllProductsAdmin((data) => {
      setProducts(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (product: ProductItem) => {
    setFormData(product);
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      category: 'Full Builds',
      status: 'draft',
      gradient: 'from-zinc-700 to-zinc-900',
      iconName: 'RocketIcon',
      price: '€',
      features: []
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Optimistic UI or just indicator
    
    try {
      if (editingId) {
        // Remove ID from payload
        const { id, ...updates } = formData as ProductItem;
        await updateProductService(editingId, updates);
      } else {
        await addProduct(formData as Omit<ProductItem, 'id'>);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Error saving product. Check console.");
    } finally {
      setIsLoading(false); // Listener will update list
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductService(id);
    }
  };

  // Helper to handle array inputs like features/tags (comma separated)
  const handleArrayInput = (key: 'features' | 'tags', value: string) => {
    setFormData({ ...formData, [key]: value.split(',').map(s => s.trim()) });
  };

  const handleMockUpload = () => {
      const url = prompt("Enter Image URL (simulating upload)", "https://picsum.photos/800/800?random=" + Math.random());
      if (url) {
          setFormData({...formData, imageUrl: url});
      }
  };

  if (isLoading && !products.length) return <div className="p-10 flex justify-center"><LoaderIcon className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Product Catalog</h2>
        <Button onClick={handleCreate} className="!py-2 !text-xs">
          <PlusIcon size={14} /> New Product
        </Button>
      </div>

      {isFormOpen ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={() => setIsFormOpen(false)}><XIcon className="text-zinc-500 hover:text-white" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-zinc-500 text-xs mb-2">Product Name</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-zinc-500 text-xs mb-2">Price String</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.price || ''}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="€950"
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
              <label className="block text-zinc-500 text-xs mb-2">Category</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.category || ''}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Full Builds">Full Builds</option>
                <option value="Assets">Assets</option>
                <option value="Templates">Templates</option>
                <option value="Services">Services</option>
              </select>
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

             {/* Image Upload/Link Section */}
             <div className="col-span-2">
                <label className="block text-zinc-500 text-xs mb-2">Product Image (Optional)</label>
                <div className="flex gap-2 mb-2">
                    <input 
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                      value={formData.imageUrl || ''}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" variant="secondary" onClick={handleMockUpload} className="!py-2">
                      <UploadIcon size={14} /> Upload
                    </Button>
                </div>
                <p className="text-[10px] text-zinc-500">
                    Recommended resolution: <strong>800x800px</strong> (Square). 
                    If left blank, a gradient background with icon will be used.
                </p>
            </div>

            <div className="col-span-2">
              <label className="block text-zinc-500 text-xs mb-2">Features (Comma separated)</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500/50 outline-none"
                value={formData.features?.join(', ') || ''}
                onChange={e => handleArrayInput('features', e.target.value)}
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </div>
            <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId ? 'Save Changes' : 'Create Product'}</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${product.gradient || 'from-zinc-800 to-zinc-900'} flex items-center justify-center shrink-0 overflow-hidden`}>
                  {product.imageUrl ? (
                     <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                     <ShoppingBagIcon size={18} className="text-white opacity-80" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold text-sm">{product.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${product.status === 'live' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                      {product.status || 'draft'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs">{product.category} • {product.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                  <SettingsIcon size={16} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors">
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