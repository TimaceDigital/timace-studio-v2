import { UserProfile, AuthSession, Order, ProductItem, Project } from '../types';

const STORAGE_KEYS = {
  USERS: 'timace_users_v1',
  SESSION: 'timace_session_v1',
  ORDERS: 'timace_orders_v1',
  PRODUCTS: 'timace_products_v1',
  BUILDS: 'timace_builds_v1'
};

// --- SEED DATA ---

const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 'prototype',
    name: "Rapid Prototype",
    category: "Full Builds",
    price: "€950",
    priceValue: 950,
    description: "Idea to clickable, functional prototype in 1 hour. Perfect for validation.",
    longDescription: "Our flagship service. We take your raw idea—whether it's a napkin sketch or a paragraph of text—and transform it into a deployed, clickable, functional prototype in 60 minutes. This is not a mockup; it's code. We use our proprietary agentic stack to scaffold the backend, generate the frontend, and deploy it live.",
    features: [
      "Clickable React Frontend",
      "Basic Database Connection",
      "Deployed Live URL",
      "Source Code Access",
      "Mobile Responsive",
      "1-Hour Turnaround"
    ],
    iconName: "RocketIcon",
    rating: 5.0,
    tags: ["Popular", "Service"],
    gradient: "from-brand-500 to-emerald-500",
    status: 'live'
  },
  {
    id: 'microsaas',
    name: "Micro-SaaS MVP",
    category: "Full Builds",
    price: "€2,450",
    priceValue: 2450,
    description: "A fully functional small-scale SaaS ready for your first paying customers.",
    longDescription: "The complete package for launching a micro-SaaS. We build the authentication, the payment gateway integration, the database schema, and the core business logic. You walk away with a product that is ready to accept users and process credit cards immediately.",
    features: [
      "Supabase Authentication",
      "Stripe Subscription Setup",
      "Admin Dashboard",
      "User Profile Management",
      "Email Transactional Setup",
      "30 Days Bug Fix Support"
    ],
    iconName: "ZapIcon",
    rating: 4.9,
    tags: ["Best Value"],
    gradient: "from-purple-500 to-indigo-600",
    status: 'live'
  },
  {
    id: 'marketing',
    name: "Marketing Site",
    category: "Full Builds",
    price: "€1,200",
    priceValue: 1200,
    description: "High-performance landing page designed to convert visitors into users.",
    longDescription: "A stunning, high-performance landing page built to convert. We focus on SEO, load speed (Core Web Vitals), and visual impact. Includes clear CTAs, testimonial sections, and lead capture forms integrated with your preferred CRM.",
    features: [
      "Next.js / Astro Architecture",
      "SEO Optimization",
      "Google Analytics 4 Setup",
      "Lead Capture Form",
      "CMS Integration (Optional)",
      "Lighthouse Score 95+"
    ],
    iconName: "GlobeIcon",
    rating: 4.8,
    tags: ["Service"],
    gradient: "from-blue-500 to-cyan-500",
    status: 'live'
  },
  {
    id: 'ui-kit',
    name: "Timace UI System",
    category: "Assets",
    price: "€149",
    priceValue: 149,
    description: "The complete Figma & React component library used in our own studio.",
    longDescription: "Access the exact design system used to build Timace Studio v2. Includes over 50+ pre-built React components, Tailwind configuration files, and a comprehensive Figma design file. Perfect for developers who want the 'Timace Look' without starting from scratch.",
    features: [
      "Figma Design File (.fig)",
      "React Component Library",
      "Tailwind Config Preset",
      "Icon Set (SVG)",
      "Dark Mode Optimized",
      "Lifetime Updates"
    ],
    iconName: "DownloadIcon",
    rating: 5.0,
    tags: ["Digital Asset"],
    gradient: "from-pink-500 to-rose-500",
    status: 'live'
  },
  {
    id: 'boilerplate',
    name: "AI Agent Boilerplate",
    category: "Templates",
    price: "€299",
    priceValue: 299,
    description: "NextJS + LangChain + Gemini starter kit for building agentic apps.",
    longDescription: "Jumpstart your AI development with our production-ready boilerplate. Pre-configured with Google Gemini API, LangChain, Vercel AI SDK, and a robust streaming architecture. Stop fighting with configuration and start building intelligence.",
    features: [
      "Next.js 14 App Router",
      "Gemini API Integration",
      "Streaming Response UI",
      "LangChain Setup",
      "Rate Limiting Logic",
      "Vercel Deploy Ready"
    ],
    iconName: "ServerIcon",
    rating: 4.7,
    tags: ["Code"],
    gradient: "from-amber-500 to-orange-600",
    status: 'live'
  },
  {
    id: 'custom-arch',
    name: "Custom Architecture",
    category: "Services",
    price: "Custom",
    priceValue: 0,
    description: "Deep backend logic and multi-agent systems consultation.",
    longDescription: "For projects that defy standard categorization. We provide high-level architectural consulting to map out complex multi-agent systems, scalable backend infrastructure, and enterprise-grade security protocols.",
    features: [
      "System Architecture Diagram",
      "Database Schema Design",
      "Security Audit",
      "Scalability Roadmap",
      "Tech Stack Selection",
      "4 Hours Consultation"
    ],
    iconName: "ServerIcon",
    rating: 5.0,
    tags: ["Enterprise"],
    gradient: "from-zinc-700 to-zinc-900",
    status: 'live'
  }
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: "Salary Compass",
    category: "Analytics Platform",
    description: "Real-time market salary data visualization dashboard for HR professionals.",
    image: "https://picsum.photos/800/600?random=1",
    status: 'live'
  },
  {
    id: 'proj_2',
    title: "Tech Recruitment",
    category: "Hiring Portal",
    description: "Automated candidate matching system using semantic search algorithms.",
    image: "https://picsum.photos/800/600?random=2",
    status: 'live'
  },
  {
    id: 'proj_3',
    title: "Global VAT Calc",
    category: "FinTech Tool",
    description: "Complex cross-border tax compliance calculator for digital goods.",
    image: "https://picsum.photos/800/600?random=3",
    status: 'live'
  },
  {
    id: 'proj_4',
    title: "Attravio",
    category: "E-Commerce",
    description: "High-performance headless storefront with sub-second page loads.",
    image: "https://picsum.photos/800/600?random=4",
    status: 'live'
  },
  {
    id: 'proj_5',
    title: "Timace Digital",
    category: "Agency Site",
    description: "The v1 predecessor. A testament to our evolution.",
    image: "https://picsum.photos/800/600?random=5",
    status: 'live'
  },
  {
    id: 'proj_6',
    title: "Idea Generator",
    category: "AI Tool",
    description: "Agentic system for generating and validating SaaS ideas.",
    image: "https://picsum.photos/800/600?random=6",
    status: 'live'
  },
  {
    id: 'proj_7',
    title: "Tech Consultancy",
    category: "Corporate",
    description: "Clean, authority-building presence for a high-end consultancy firm.",
    image: "https://picsum.photos/800/600?random=7",
    status: 'live'
  },
  {
    id: 'proj_8',
    title: "Name Gen",
    category: "Micro-SaaS",
    description: "Business name generator with domain availability checking.",
    image: "https://picsum.photos/800/600?random=8",
    status: 'live'
  }
];

// Internal interface for stored user data including password
interface StoredUser extends UserProfile {
  passwordHash: string; 
}

// --- Event Emitter for Real-time Updates ---

type Listener = () => void;
const listeners: Listener[] = [];

const notifyListeners = () => {
  listeners.forEach(l => l());
};

export const subscribeToDataChanges = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

// Listen for cross-tab updates via localStorage events
window.addEventListener('storage', (e) => {
  if ([STORAGE_KEYS.ORDERS, STORAGE_KEYS.PRODUCTS, STORAGE_KEYS.BUILDS].includes(e.key || '')) {
    notifyListeners();
  }
});

// --- Database Simulation Helpers ---

const getDB = () => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  
  // Products - Seeding logic
  let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || 'null');
  if (!products) {
    products = SEED_PRODUCTS;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // Builds - Seeding logic
  let builds = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUILDS) || 'null');
  if (!builds) {
    builds = SEED_PROJECTS;
    localStorage.setItem(STORAGE_KEYS.BUILDS, JSON.stringify(builds));
  }

  return { users: users as StoredUser[], orders: orders as Order[], products: products as ProductItem[], builds: builds as Project[] };
};

const saveDB = (data: { users?: StoredUser[], orders?: Order[], products?: ProductItem[], builds?: Project[] }) => {
  if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
  if (data.orders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
  if (data.products) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
  if (data.builds) localStorage.setItem(STORAGE_KEYS.BUILDS, JSON.stringify(data.builds));
  notifyListeners();
};

// --- Auth Methods ---

export const register = async (name: string, email: string, password: string): Promise<AuthSession> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const { users } = getDB();
  
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: StoredUser = {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    passwordHash: password,
    role: 'client',
    joinedAt: new Date().toISOString(),
    preferences: { emailNotifications: true, slackIntegration: false }
  };

  users.push(newUser);
  saveDB({ users });

  return createSession(newUser);
};

export const login = async (email: string, password: string): Promise<AuthSession> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (email === 'admin@timace.studio' && password === 'password') {
    const adminUser: StoredUser = {
      id: 'admin_001',
      name: 'Studio Admin',
      email: 'admin@timace.studio',
      role: 'admin',
      passwordHash: 'password'
    };
    return createSession(adminUser);
  }

  const { users } = getDB();
  const user = users.find(u => u.email === email && u.passwordHash === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  return createSession(user);
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  return Promise.resolve();
};

const createSession = (user: StoredUser): AuthSession => {
  const { passwordHash, ...safeUser } = user;
  const session: AuthSession = {
    user: safeUser,
    token: `tkn_${Math.random().toString(36).substr(2)}`, 
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
};

export const getSession = (): AuthSession | null => {
  const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!sessionStr) return null;
  
  const session = JSON.parse(sessionStr) as AuthSession;
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return null;
  }
  return session;
};

// --- General Data Access ---

export const saveNewOrder = (order: Order) => {
  const { orders } = getDB();
  orders.unshift(order);
  saveDB({ orders });
};

export const getAllOrders = (): Order[] => {
  const { orders } = getDB();
  return orders;
};

export const getClientOrders = (clientId: string): Order[] => {
  const { orders } = getDB();
  return orders.filter(o => o.clientId === clientId);
};

export const updateOrderInDb = (updatedOrder: Order) => {
  const { orders } = getDB();
  const index = orders.findIndex(o => o.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = updatedOrder;
    saveDB({ orders });
  }
};

// --- Product Management ---

export const getAllProducts = (): ProductItem[] => {
  const { products } = getDB();
  return products;
};

export const saveProductToDb = (product: ProductItem) => {
  const { products } = getDB();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
  } else {
    products.push(product);
  }
  saveDB({ products });
};

export const deleteProductFromDb = (productId: string) => {
  const { products } = getDB();
  const newProducts = products.filter(p => p.id !== productId);
  saveDB({ products: newProducts });
};

// --- Build/Portfolio Management ---

export const getAllBuilds = (): Project[] => {
  const { builds } = getDB();
  return builds;
};

export const saveBuildToDb = (build: Project) => {
  const { builds } = getDB();
  const index = builds.findIndex(b => b.id === build.id);
  if (index !== -1) {
    builds[index] = build;
  } else {
    builds.push(build);
  }
  saveDB({ builds });
};

export const deleteBuildFromDb = (buildId: string) => {
  const { builds } = getDB();
  const newBuilds = builds.filter(b => b.id !== buildId);
  saveDB({ builds: newBuilds });
};