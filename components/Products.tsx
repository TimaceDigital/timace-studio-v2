import React, { useState, useEffect } from 'react';
import { 
  RocketIcon, GlobeIcon, ServerIcon, ZapIcon, 
  SearchIcon, FilterIcon, StarIcon, PlusIcon, DownloadIcon, LoaderIcon
} from './Icons';
import { Button } from './Button';
import { ProductItem } from '../types';
import { getLiveProducts } from '../services/authService';

interface ProductsProps {
  onAddToCart?: (product: ProductItem) => void;
  onProductClick?: (product: ProductItem) => void;
}

const IconMap: Record<string, React.FC<any>> = {
  RocketIcon, GlobeIcon, ServerIcon, ZapIcon, DownloadIcon
};

const getIconComponent = (product: ProductItem) => {
  if (product.icon) return product.icon; // If passed as prop directly (legacy)
  const IconComp = product.iconName ? IconMap[product.iconName] : ServerIcon;
  return <IconComp size={40} className="text-white" />;
};

const categories = ["All", "Full Builds", "Assets", "Templates", "Services"];

export const Products: React.FC<ProductsProps> = ({ onAddToCart, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to live products from Firestore
    const unsubscribe = getLiveProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="min-h-screen pt-48 flex justify-center"><LoaderIcon className="animate-spin text-zinc-600" /></div>;

  return (
    <div className="pt-48 pb-16 min-h-screen bg-zinc-950">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 animate-fade-in space-y-8">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FilterIcon size={16} /> Filters
              </h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeCategory === cat 
                        ? 'bg-zinc-900 text-white font-medium border border-zinc-800' 
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-900/20 to-zinc-900 border border-brand-500/10">
              <h4 className="text-white font-bold mb-2">Need a Custom Build?</h4>
              <p className="text-xs text-zinc-400 mb-4">
                Our AI architects can design a solution specifically for your needs.
              </p>
              <Button variant="outline" className="w-full !py-2 !text-xs !border-brand-500/30 !text-brand-300 hover:!bg-brand-500/10">
                Get Estimate
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Header / Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 animate-fade-in-up">
              <h1 className="text-2xl font-bold text-white">Store</h1>
              
              <div className="relative w-full sm:w-80 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <SearchIcon size={16} className="text-zinc-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  onClick={() => onProductClick?.(product)}
                  className="group bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 animate-fade-in-up flex flex-col cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  {/* Thumbnail */}
                  <div className={`h-48 w-full bg-gradient-to-br ${product.gradient || 'from-zinc-800 to-zinc-900'} relative flex items-center justify-center overflow-hidden`}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="transform transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                        {getIconComponent(product)}
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                       {product.tags?.map(tag => (
                         <span key={tag} className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs text-zinc-500 font-mono uppercase tracking-wide">{product.category}</div>
                      {product.rating && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <StarIcon size={12} fill="currentColor" /> {product.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{product.name}</h3>
                    <p className="text-sm text-zinc-400 mb-6 line-clamp-2 flex-grow">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                      <div className="text-xl font-bold text-white">
                        {product.price}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking add to cart
                          onAddToCart?.(product);
                        }}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors active:scale-95"
                      >
                        <PlusIcon size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">No products found for "{searchQuery}"</p>
                <Button 
                  variant="ghost" 
                  className="mt-4"
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};