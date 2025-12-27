import React from 'react';
import { 
  RocketIcon, GlobeIcon, ServerIcon, ZapIcon, 
  DownloadIcon, SettingsIcon, LayoutIcon, DatabaseIcon 
} from '../Icons';
import { ProductItem } from '../../types';

// --- Icon Mapping Helper ---
export const IconMap: Record<string, React.FC<any>> = {
  RocketIcon, GlobeIcon, ServerIcon, ZapIcon, DownloadIcon, SettingsIcon, LayoutIcon, DatabaseIcon
};

export const getProductIcon = (product: ProductItem) => {
  // If the product object has a valid ReactNode as 'icon', use it.
  if (React.isValidElement(product.icon)) {
      return product.icon;
  }
  
  // If it has an iconName, resolve it
  if (product.iconName && IconMap[product.iconName]) {
      const IconComp = IconMap[product.iconName];
      return <IconComp size={40} className="text-white" />;
  }

  // Fallback
  return <ServerIcon size={40} className="text-white" />;
};


// --- Configuration Schema Definition ---
export type FieldType = 'select' | 'color' | 'radio';

export interface ConfigField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  helperText?: string;
}

export const CONFIG_SCHEMAS: Record<string, ConfigField[]> = {
  'marketing': [
    { 
      id: 'aesthetic', 
      label: 'Visual Aesthetic', 
      type: 'select', 
      options: ['Minimal & Clean', 'Brutalist & Bold', 'Corporate & Trust', 'Playful & Vibrant', 'Dark Mode / Cyberpunk', 'Luxury & Serif'],
      helperText: 'Sets the mood board for the agentic designer.'
    },
    { 
      id: 'typography', 
      label: 'Typography Style', 
      type: 'select', 
      options: ['Sans Serif (Inter/Geist)', 'Serif (Playfair/Merriweather)', 'Monospace (JetBrains/Fira)', 'Mixed'],
    },
    { 
      id: 'primary_color', 
      label: 'Primary Brand Color', 
      type: 'select', 
      options: ['Blue', 'Green', 'Purple', 'Orange', 'Red', 'Black/White', 'Yellow', 'Teal']
    }
  ],
  'saas': [
    { 
      id: 'auth_provider', 
      label: 'Authentication Provider', 
      type: 'radio', 
      options: ['Supabase Auth', 'Firebase Auth', 'Clerk', 'NextAuth', 'None'],
      helperText: 'We will scaffold the user tables and login flows.'
    },
    { 
      id: 'database', 
      label: 'Database Preference', 
      type: 'select', 
      options: ['PostgreSQL (Supabase)', 'Firestore (Firebase)', 'MongoDB', 'MySQL'],
    },
    { 
      id: 'payments', 
      label: 'Payment Gateway', 
      type: 'radio', 
      options: ['Stripe', 'LemonSqueezy', 'None'],
    },
    { 
      id: 'aesthetic', 
      label: 'Dashboard Style', 
      type: 'select', 
      options: ['Sidebar Navigation', 'Top Bar Navigation', 'Dense Data Grid', 'Card Based'],
    }
  ],
  'generic': [
    { 
      id: 'delivery_format', 
      label: 'Delivery Format', 
      type: 'select', 
      options: ['GitHub Repository', 'Zip Archive', 'Vercel Deploy Invite'],
    }
  ]
};

export const getProductSchema = (product: ProductItem): ConfigField[] => {
  if (product.category.toLowerCase().includes('full builds') || product.name.toLowerCase().includes('prototype')) {
     if (product.name.toLowerCase().includes('marketing') || product.name.toLowerCase().includes('landing')) {
       return CONFIG_SCHEMAS['marketing'];
     }
     return CONFIG_SCHEMAS['saas'];
  }
  return CONFIG_SCHEMAS['generic'];
};
