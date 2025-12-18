import React from 'react';
import { DatabaseIcon, ServerIcon, LockIcon, CloudLightningIcon, TerminalIcon, CheckCircleIcon } from '../Icons';

export const AdminSystem: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="border-b border-zinc-800 pb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
          <DatabaseIcon className="text-brand-500" size={32} />
          Production Architecture & Migration Guide
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
           This document serves as the <strong className="text-white">Master Context</strong> for AI Agents (Cursor, Windsurf, Devin) 
           migrating Timace Studio from the current <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-xs border border-zinc-800">localStorage</span> prototype 
           to a production-grade <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-xs border border-zinc-800">Supabase/Next.js</span> environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Doc Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Data Schema */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><DatabaseIcon size={20} /></div>
                <h3 className="font-bold text-white">1. Database Schema (PostgreSQL/Supabase)</h3>
             </div>
             <div className="p-6 space-y-6">
                <p className="text-zinc-400 text-sm">
                  The following SQL definition maps the current TypeScript interfaces to a relational structure. 
                  JSONB is used for flexible configuration storage.
                </p>
                
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
<pre className="text-xs font-mono text-zinc-300 leading-relaxed">
{`-- USERS (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'client' check (role in ('client', 'admin')),
  created_at timestamptz default now()
);

-- PRODUCTS (Store Inventory)
create table public.products (
  id text primary key, -- slug based id e.g., 'rapid-prototype'
  name text not null,
  category text,
  price_string text,
  price_value integer,
  description text,
  features text[], -- array of strings
  image_url text,
  status text default 'draft' check (status in ('live', 'draft')),
  metadata jsonb -- For icon names, gradients, tags
);

-- PORTFOLIO (Builds Showcase)
create table public.builds (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text,
  description text,
  image_url text,
  status text default 'draft',
  created_at timestamptz default now()
);

-- ORDERS
create table public.orders (
  id text primary key, -- e.g. 'ORD-1234'
  user_id uuid references public.profiles(id),
  title text,
  status text default 'queued',
  progress integer default 0,
  total_value integer,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ORDER ITEMS (Snapshot of what was bought)
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id),
  product_id text references public.products(id),
  product_snapshot jsonb, -- Copy of product data at time of purchase
  configuration jsonb -- User choices (colors, auth types, etc)
);

-- MESSAGES (Chat)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id),
  sender_id uuid references auth.users(id), -- or null for system
  content text,
  is_admin boolean default false,
  created_at timestamptz default now()
);`}
</pre>
                </div>
             </div>
          </section>

          {/* Section 2: Environment Config */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><LockIcon size={20} /></div>
                <h3 className="font-bold text-white">2. Environment Variables</h3>
             </div>
             <div className="p-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
<pre className="text-xs font-mono text-zinc-300 leading-relaxed">
{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key (Server only)

# AI Integration
GEMINI_API_KEY=your-gemini-key

# Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_APP_URL=https://timace.studio`}
</pre>
                </div>
             </div>
          </section>

          {/* Section 3: API Migration */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><ServerIcon size={20} /></div>
                <h3 className="font-bold text-white">3. Service Layer Migration</h3>
             </div>
             <div className="p-6 space-y-4">
                <p className="text-zinc-400 text-sm">
                  The current `services/*.ts` files mock data using `localStorage`. 
                  These must be rewritten to use the `supabase-js` client.
                </p>
                
                <div className="space-y-3">
                   <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <h4 className="text-white font-mono text-xs mb-2 text-purple-300">authService.ts → Supabase Auth</h4>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                         <li>Replace `register()` with `supabase.auth.signUp()`</li>
                         <li>Replace `login()` with `supabase.auth.signInWithPassword()`</li>
                         <li>Replace `getSession()` with `supabase.auth.getSession()`</li>
                         <li>Implement `onAuthStateChange` listener in App.tsx</li>
                      </ul>
                   </div>
                   
                   <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <h4 className="text-white font-mono text-xs mb-2 text-purple-300">dashboardService.ts → DB Queries</h4>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                         <li>Fetch Orders: `supabase.from('orders').select('*, items:order_items(*)')`</li>
                         <li>Realtime Updates: Use `supabase.channel('orders').on(...)` for live dashboard status</li>
                         <li>Chat: Subscribe to `messages` table for instant updates</li>
                      </ul>
                   </div>

                   <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                      <h4 className="text-white font-mono text-xs mb-2 text-purple-300">geminiService.ts → Edge Functions</h4>
                      <p className="text-xs text-zinc-500 mb-1">Do not expose API keys in frontend code.</p>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                         <li>Move `analyzeProjectIdea` to a Next.js API Route or Supabase Edge Function</li>
                         <li>Move `generateCheckoutSuggestions` to server-side</li>
                      </ul>
                   </div>
                </div>
             </div>
          </section>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           
           {/* Quick Actions */}
           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Migration Checklist</h3>
              <ul className="space-y-3">
                 {[
                   "Set up Supabase Project",
                   "Run SQL Schema Migration",
                   "Enable Row Level Security (RLS)",
                   "Configure Storage Buckets",
                   "Swap Auth Provider",
                   "Move AI Calls to Backend",
                   "Connect Stripe Webhooks"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <div className="w-5 h-5 rounded border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                         <div className="w-3 h-3 rounded-sm bg-zinc-800"></div>
                      </div>
                      {item}
                   </li>
                 ))}
              </ul>
           </div>

           {/* Storage Config */}
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                 <CloudLightningIcon className="text-brand-400" size={18} /> Storage Buckets
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                 Required public buckets for file assets.
              </p>
              <div className="space-y-2">
                 <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-800">
                    <span className="text-xs font-mono text-zinc-300">product-images</span>
                    <span className="text-[10px] text-green-500 uppercase">Public</span>
                 </div>
                 <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-800">
                    <span className="text-xs font-mono text-zinc-300">order-assets</span>
                    <span className="text-[10px] text-amber-500 uppercase">Authenticated</span>
                 </div>
                 <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-800">
                    <span className="text-xs font-mono text-zinc-300">chat-attachments</span>
                    <span className="text-[10px] text-amber-500 uppercase">Authenticated</span>
                 </div>
              </div>
           </div>

           {/* Security Warning */}
           <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2 text-red-200 font-bold text-sm">
                 <LockIcon size={16} /> Security Rules
              </div>
              <p className="text-xs text-red-200/70 leading-relaxed">
                 Ensure RLS policies are strict. 
                 <br/><br/>
                 - <strong>Clients</strong> can only view their own orders.
                 <br/>
                 - <strong>Admins</strong> have full access to all tables.
                 <br/>
                 - <strong>Public</strong> can only read `products` and `builds`.
              </p>
           </div>

        </div>

      </div>
    </div>
  );
};