import React from 'react';
import { DatabaseIcon, ServerIcon, LockIcon, CloudLightningIcon, TerminalIcon, CheckCircleIcon } from '../Icons';

export const AdminSystem: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="border-b border-zinc-800 pb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
          <DatabaseIcon className="text-brand-500" size={32} />
          System Architecture & Firebase Context
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
           This document serves as the <strong className="text-white">Master Context</strong> for the production system running on 
           <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-xs border border-zinc-800 ml-1">Firebase (Auth, Firestore, Functions, Hosting)</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Doc Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Data Schema */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><DatabaseIcon size={20} /></div>
                <h3 className="font-bold text-white">1. Firestore NoSQL Schema</h3>
             </div>
             <div className="p-6 space-y-6">
                <p className="text-zinc-400 text-sm">
                  The application uses a collection-based NoSQL structure optimized for real-time listeners and role-based security.
                </p>
                
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
<pre className="text-xs font-mono text-zinc-300 leading-relaxed">
{`// USERS Collection
// Doc ID: uid (from Auth)
users/{userId} {
  userId: string;
  email: string;
  displayName: string;
  role: 'client' | 'admin';
  createdAt: timestamp;
}

// PRODUCTS Collection (Public Read, Admin Write)
products/{productId} {
  name: string;
  category: string;
  price: string;
  priceValue: number;
  description: string;
  features: string[];
  imageUrl?: string;
  status: 'live' | 'draft';
  gradient: string;
}

// SHOWCASE BUILDS (Public Portfolio)
showcaseBuilds/{buildId} {
  title: string;
  description: string;
  category: string;
  image: string;
  status: 'live' | 'draft';
}

// CLIENT ORDERS
clientOrders/{orderId} {
  clientId: string; (FK to users)
  clientName: string;
  title: string;
  status: 'queued' | 'analyzing' | 'building' | 'review' | 'completed';
  items: ProductItem[];
  configurations: Record<string, any>;
  notes: string;
  totalValue: number;
  createdAt: string;
}

// CLIENT BUILDS (Private Progress Tracker)
clientBuilds/{buildId} {
  orderId: string;
  userId: string;
  status: 'started' | 'in_progress';
  progress: number; // 0-100
  updates: [{ message, timestamp }];
  liveUrl?: string;
}

// MESSAGES (Real-time Chat)
messages/{messageId} {
  orderId: string;
  senderId: string;
  content: string;
  isAdmin: boolean;
  timestamp: string;
}`}
</pre>
                </div>
             </div>
          </section>

          {/* Section 2: Security Rules */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><LockIcon size={20} /></div>
                <h3 className="font-bold text-white">2. Firestore Security Rules</h3>
             </div>
             <div className="p-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
<pre className="text-xs font-mono text-zinc-300 leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admin Override
    function isAdmin() {
      return request.auth.token.role == 'admin';
    }

    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || isAdmin();
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /clientOrders/{orderId} {
      allow read: if resource.data.clientId == request.auth.uid || isAdmin();
      allow create: if request.auth.uid != null;
      allow update: if isAdmin();
    }
    
    // ... similar patterns for builds/messages
  }
}`}
</pre>
                </div>
             </div>
          </section>

          {/* Section 3: Backend Logic */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><ServerIcon size={20} /></div>
                <h3 className="font-bold text-white">3. Cloud Functions (Serverless)</h3>
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-3">
                   <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <h4 className="text-white font-mono text-xs mb-2 text-purple-300">Auth Triggers</h4>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                         <li>`onUserCreate`: Automatically creates User document and assigns 'client' role custom claim.</li>
                      </ul>
                   </div>
                   
                   <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <h4 className="text-white font-mono text-xs mb-2 text-purple-300">Payments & Webhooks</h4>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                         <li>`createCheckoutSession`: Securely initializes Stripe.</li>
                         <li>`stripeWebhook`: Listens for payment success to create Orders/Builds automatically.</li>
                      </ul>
                   </div>

                   <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <h4 className="text-white font-mono text-xs mb-2 text-purple-300">Admin Utilities</h4>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                         <li>`makeAdmin`: Callable function to promote users (secured).</li>
                      </ul>
                   </div>
                </div>
             </div>
          </section>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           
           {/* Deployment Info */}
           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Live Deployment</h3>
              <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircleIcon size={16} className="text-green-500" />
                    <span>Hosting: Firebase Hosting</span>
                 </li>
                 <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircleIcon size={16} className="text-green-500" />
                    <span>Auth: Email/Password</span>
                 </li>
                 <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircleIcon size={16} className="text-green-500" />
                    <span>DB: Firestore (us-central1)</span>
                 </li>
                 <li className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircleIcon size={16} className="text-green-500" />
                    <span>API: Cloud Functions Node 20</span>
                 </li>
              </ul>
           </div>

           {/* AI Integration */}
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                 <CloudLightningIcon className="text-brand-400" size={18} /> AI Core
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                 Gemini 2.5 Flash is integrated via client-side SDK (protected by restricted API key) for instant estimation and configuration.
              </p>
           </div>

        </div>

      </div>
    </div>
  );
};