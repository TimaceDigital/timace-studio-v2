import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Workflow } from './components/Workflow';
import { Portfolio } from './components/Portfolio';
import { AiEstimator } from './components/AiEstimator';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Philosophy } from './components/Philosophy';
import { Builds } from './components/Builds';
import { Pricing } from './components/Pricing';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { ProductDetail } from './components/ProductDetail';
import { WebsiteFeatures } from './components/WebsiteFeatures';
import { SupportPage } from './components/SupportPage';
import { SupportChat } from './components/SupportChat';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductionPipeline } from './components/ProductionPipeline';
import { FAQ } from './components/FAQ';
import { ShoppingBagIcon, XIcon, TrashIcon, MenuIcon, ArrowRightIcon, CheckCircleIcon, UserIcon, LogOutIcon } from './components/Icons';
import { ProductItem, UserProfile } from './types';
import { PossibilitiesTeaser } from './components/PossibilitiesTeaser';
import { Possibilities } from './components/Possibilities';
import { DashboardTeaser } from './components/DashboardTeaser';
import { Checkout } from './components/Checkout';
import { ClientLogin } from './components/ClientLogin';
import { getSession, logout } from './services/authService';

type View = 'home' | 'philosophy' | 'products' | 'product-detail' | 'builds' | 'pricing' | 'dashboard' | 'support' | 'admin-login' | 'admin-portal' | 'capabilities' | 'checkout' | 'success' | 'client-login';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<ProductItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Selected product state for detail view
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    // Check for active session
    const session = getSession();
    if (session) {
      setUser(session.user);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleAddToCart = (product: ProductItem) => {
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const navigate = (view: View) => {
    // Protect dashboard route
    if (view === 'dashboard' && !user) {
      setCurrentView('client-login');
    } else {
      setCurrentView(view);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: ProductItem) => {
    setSelectedProduct(product);
    navigate('product-detail');
  };

  const handleClientLogout = async () => {
    await logout();
    setUser(null);
    navigate('home');
  };

  // --- Admin Logic ---
  const handleAdminLogin = () => {
    setCurrentView('admin-portal');
  };

  const handleAdminLogout = () => {
    logout(); // Clear session
    setCurrentView('home');
  };

  // If in Admin Portal, render exclusively
  if (currentView === 'admin-portal') {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // If in Admin Login, render exclusively
  if (currentView === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => navigate('home')} />;
  }

  // If in Client Login
  if (currentView === 'client-login') {
    return (
      <ClientLogin 
        onLoginSuccess={(session) => {
          setUser(session.user);
          navigate('dashboard');
        }} 
        onBack={() => navigate('home')} 
      />
    );
  }

  const renderContent = () => {
    switch(currentView) {
      case 'philosophy':
        return <Philosophy />;
      case 'products':
        return <Products onAddToCart={handleAddToCart} onProductClick={handleProductClick} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => navigate('products')} 
            onAddToCart={handleAddToCart} 
          />
        ) : (
          <Products onAddToCart={handleAddToCart} onProductClick={handleProductClick} />
        );
      case 'capabilities':
        return <Possibilities onCtaClick={() => navigate('products')} />;
      case 'builds':
        return <Builds />;
      case 'pricing':
        return <Pricing />;
      case 'dashboard':
        return <Dashboard />;
      case 'support':
        return <SupportPage />;
      case 'checkout':
        return (
          <Checkout 
             cart={cart}
             onRemoveItem={removeFromCart}
             onBack={() => navigate('products')}
             onSuccess={() => {
               setCart([]);
               navigate('success');
             }}
             currentUser={user}
          />
        );
      case 'success':
        return (
          <div className="min-h-screen pt-32 pb-20 flex items-center justify-center container mx-auto px-6">
             <div className="bg-zinc-900/50 border border-green-500/30 p-12 rounded-3xl text-center max-w-lg animate-fade-in-up">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <CheckCircleIcon size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Sequence Initiated</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Your order has been received. Our Agentic Core is now analyzing your brief. 
                  <br/><br/>
                  Access your live dashboard to track progress.
                </p>
                <Button onClick={() => navigate('dashboard')} variant="primary" fullWidth>
                  Go to Dashboard
                </Button>
              </div>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="animate-fade-in">
            <Hero />
            <Features />
            <PossibilitiesTeaser onNavigate={() => navigate('capabilities')} />
            <ProductionPipeline />
            <DashboardTeaser onNavigate={() => navigate('dashboard')} />
            <AiEstimator />
            <Workflow />
            <Portfolio />
            <WebsiteFeatures />
            <FAQ />
            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden border-t border-zinc-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950"></div>
              <div className="container mx-auto px-6 relative z-10 text-center">
                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to execute?</h2>
                 <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto font-light">
                   Idea to functional prototype in 1 hour. No calls, no delays.
                 </p>
                 <div className="flex justify-center gap-4">
                   <Button onClick={() => navigate('products')} className="min-w-[160px]">Start Project</Button>
                 </div>
              </div>
            </section>
          </div>
        );
    }
  };

  const navLinkClass = (view: View) => 
    `cursor-pointer text-sm font-medium transition-all duration-300 relative px-1 py-1 ${
      currentView === view 
        ? 'text-white' 
        : 'text-zinc-400 hover:text-white'
    }`;

  const ActiveIndicator = () => (
    <span className="absolute -bottom-1 left-0 w-full h-px bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></span>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled || isMobileMenuOpen || currentView === 'checkout' ? 'bg-zinc-950/90 backdrop-blur-md border-b border-white/5 py-2' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between relative z-50">
          <div 
            className="group flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate('home')}
          >
            <img 
              src="https://timacestudio.com/assets/Timace%20StudioStack%20Logo-B4BJPqeF.png" 
              alt="Timace Studio v2" 
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled || isMobileMenuOpen || currentView === 'checkout' ? 'h-8 md:h-10' : 'h-24 md:h-32'
              }`}
            />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a onClick={() => navigate('products')} className={navLinkClass('products')}>
              Products
              {(currentView === 'products' || currentView === 'product-detail') && <ActiveIndicator />}
            </a>
            <a onClick={() => navigate('capabilities')} className={navLinkClass('capabilities')}>
              Capabilities
              {currentView === 'capabilities' && <ActiveIndicator />}
            </a>
            <a onClick={() => navigate('philosophy')} className={navLinkClass('philosophy')}>
              Philosophy
              {currentView === 'philosophy' && <ActiveIndicator />}
            </a>
            <a onClick={() => navigate('builds')} className={navLinkClass('builds')}>
              Builds
              {currentView === 'builds' && <ActiveIndicator />}
            </a>
            <a onClick={() => navigate('pricing')} className={navLinkClass('pricing')}>
              Pricing
              {currentView === 'pricing' && <ActiveIndicator />}
            </a>
            <a onClick={() => navigate('dashboard')} className={navLinkClass('dashboard')}>
              Dashboard
              {currentView === 'dashboard' && <ActiveIndicator />}
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div 
                className="group cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                   if (currentView === 'checkout') return;
                   setIsCartOpen(!isCartOpen);
                   if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
              >
                <ShoppingBagIcon className={`transition-colors ${isCartOpen || currentView === 'checkout' ? 'text-brand-400' : 'text-zinc-400 group-hover:text-white'}`} size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-fade-in">
                    {cart.length}
                  </span>
                )}
              </div>

              {/* Cart Dropdown */}
              {isCartOpen && currentView !== 'checkout' && (
                <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up z-50 origin-top-right">
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">Your Cart ({cart.length})</h3>
                    <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white">
                      <XIcon size={18} />
                    </button>
                  </div>
                  
                  <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-zinc-500">
                         <ShoppingBagIcon className="mx-auto mb-3 opacity-20" size={48} />
                         <p>Your cart is empty.</p>
                      </div>
                    ) : (
                      cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex gap-4 items-start group">
                           <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                               <div className="scale-50 text-white">
                                 {item.icon}
                               </div>
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                             <p className="text-zinc-500 text-xs">{item.category}</p>
                             <div className="text-zinc-300 text-sm font-bold mt-1">{item.price}</div>
                           </div>
                           <button 
                             onClick={() => removeFromCart(index)}
                             className="text-zinc-600 hover:text-red-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
                           >
                             <TrashIcon size={16} />
                           </button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
                       <div className="flex justify-between items-center mb-4">
                         <span className="text-zinc-400 text-sm">Total</span>
                         <span className="text-xl font-bold text-white">
                           €{cart.reduce((acc, item) => acc + (item.priceValue || 0), 0).toLocaleString()}
                         </span>
                       </div>
                       <Button fullWidth onClick={() => {
                         setIsCartOpen(false);
                         navigate('checkout');
                       }}>
                         Checkout
                       </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {user ? (
               <div className="hidden md:flex items-center gap-3">
                 <button 
                   onClick={() => navigate('dashboard')}
                   className="flex items-center gap-2 text-sm text-white hover:text-brand-400 transition-colors"
                 >
                   <UserIcon size={16} />
                   <span className="max-w-[100px] truncate">{user.name}</span>
                 </button>
                 <button onClick={handleClientLogout} className="text-zinc-500 hover:text-white" title="Log Out">
                    <LogOutIcon size={16} />
                 </button>
               </div>
            ) : (
              <Button 
                variant="secondary" 
                className="!py-2 !px-4 !text-xs hidden md:flex"
                onClick={() => navigate('client-login')}
              >
                Client Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 bg-zinc-950 pt-28 px-6 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
           {/* ... Background Elements ... */}
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

           <div className="flex flex-col h-full relative z-10 overflow-y-auto pb-10">
              <div className="flex flex-col gap-1">
                {['products', 'capabilities', 'philosophy', 'builds', 'pricing', 'dashboard'].map((item, idx) => (
                  <a 
                    key={item}
                    onClick={() => navigate(item as View)} 
                    className={`group flex items-center justify-between py-5 border-b border-zinc-900 transition-all duration-300 cursor-pointer ${
                      currentView === item || (item === 'products' && currentView === 'product-detail')
                        ? 'text-white border-zinc-800' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                     <span className="text-3xl font-bold capitalize tracking-tight">{item}</span>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                       currentView === item || (item === 'products' && currentView === 'product-detail')
                         ? 'border-brand-500 text-brand-500 rotate-0 bg-brand-500/10' 
                         : 'border-zinc-800 text-zinc-800 -rotate-45 group-hover:border-zinc-700 group-hover:text-zinc-500'
                     }`}>
                        <ArrowRightIcon size={18} />
                     </div>
                  </a>
                ))}
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 {user ? (
                    <Button 
                     variant="secondary" 
                     fullWidth
                     onClick={handleClientLogout}
                     className="h-14 !text-sm !font-medium"
                   >
                     Log Out
                   </Button>
                 ) : (
                   <Button 
                     variant="secondary" 
                     fullWidth
                     onClick={() => navigate('client-login')}
                     className="h-14 !text-sm !font-medium"
                   >
                     Client Login
                   </Button>
                 )}
                 <Button 
                   variant="primary" 
                   fullWidth
                   onClick={() => navigate('products')}
                   className="h-14 !text-sm !font-medium"
                 >
                   Start Project
                 </Button>
              </div>

              <div className="mt-auto text-center pt-10 pb-6 opacity-60">
                 <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    System Operational
                 </div>
                 <div className="text-zinc-700 text-xs font-bold tracking-widest">TIMACE STUDIO v2</div>
              </div>
           </div>
      </div>

      <main className="min-h-screen">
        {renderContent()}
      </main>

      {/* Global Support Chat Widget */}
      <SupportChat onNavigate={navigate} />

      {currentView !== 'checkout' && currentView !== 'client-login' && <Footer onAdminClick={() => navigate('admin-login')} />}
    </div>
  );
}

export default App;