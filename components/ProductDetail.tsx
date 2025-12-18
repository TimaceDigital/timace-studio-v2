import React from 'react';
import { ProductItem } from '../types';
import { Button } from './Button';
import { 
  ArrowRightIcon, CheckIcon, StarIcon, ShieldCheckIcon, ZapIcon, PlusIcon,
  RocketIcon, GlobeIcon, ServerIcon, DownloadIcon
} from './Icons';

// Map for dynamic icon resolution matching Products.tsx
const IconMap: Record<string, React.FC<any>> = {
  RocketIcon, GlobeIcon, ServerIcon, ZapIcon, DownloadIcon
};

interface ProductDetailProps {
  product: ProductItem;
  onBack: () => void;
  onAddToCart: (product: ProductItem) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  
  const renderIcon = () => {
    // If a React Element is already provided (legacy or static data), use it
    if (product.icon) {
      return React.cloneElement(product.icon as React.ReactElement<any>, { size: 120 });
    }
    
    // Otherwise resolve from name
    const IconComp = product.iconName ? IconMap[product.iconName] : ServerIcon;
    return <IconComp size={120} className="text-white" />;
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-zinc-950 animate-fade-in">
      <div className="container mx-auto px-6">
        {/* Breadcrumb / Back */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm group"
        >
          <ArrowRightIcon size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Visuals */}
          <div className="space-y-8">
            <div className={`aspect-square w-full rounded-3xl bg-gradient-to-br ${product.gradient || 'from-zinc-800 to-zinc-900'} flex items-center justify-center relative overflow-hidden shadow-2xl`}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <div className="transform scale-150 drop-shadow-2xl p-12">
                    {renderIcon()}
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <ShieldCheckIcon className="text-brand-500" /> Timace Guarantee
               </h3>
               <div className="space-y-3 text-sm text-zinc-400">
                 <p className="flex items-start gap-2">
                   <CheckIcon size={16} className="mt-0.5 text-zinc-600" />
                   100% Code Ownership upon delivery.
                 </p>
                 <p className="flex items-start gap-2">
                   <CheckIcon size={16} className="mt-0.5 text-zinc-600" />
                   Secure payment via Stripe.
                 </p>
                 <p className="flex items-start gap-2">
                   <CheckIcon size={16} className="mt-0.5 text-zinc-600" />
                   3 Rounds of included revisions.
                 </p>
               </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
               {product.tags?.map(tag => (
                 <span key={tag} className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                   {tag}
                 </span>
               ))}
               <div className="flex items-center gap-1 text-amber-400 text-sm font-bold ml-auto">
                  <StarIcon size={14} fill="currentColor" /> {product.rating?.toFixed(1)}
               </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-8">
               <span className="text-3xl md:text-4xl font-bold text-white">{product.price}</span>
               {product.price !== 'Custom' && <span className="text-zinc-500 mb-1.5">one-time fee</span>}
            </div>

            <p className="text-lg text-zinc-400 leading-relaxed mb-10 border-l-2 border-brand-500 pl-6">
              {product.longDescription || product.description}
            </p>

            <div className="mb-10">
               <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-zinc-500">What's Included</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {product.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-300">
                       <div className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                         <CheckIcon size={12} />
                       </div>
                       <span className="text-sm">{feature}</span>
                    </div>
                 )) || (
                    <div className="text-zinc-500 italic">Standard feature set included.</div>
                 )}
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-zinc-800">
               <Button 
                 onClick={() => onAddToCart(product)}
                 className="h-14 text-base flex-1"
               >
                 <PlusIcon size={18} /> Add to Cart
               </Button>
               <Button 
                 variant="outline" 
                 className="h-14 text-base sm:w-auto"
                 onClick={() => alert('Demo: This would open a direct consultation chat.')}
               >
                 <ZapIcon size={18} /> Ask a Question
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};