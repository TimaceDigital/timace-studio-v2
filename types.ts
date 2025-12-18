import React from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  status?: 'live' | 'draft';
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AnalysisResponse {
  feasibility: string;
  stackRecommendation: string;
  estimatedTimeline: string;
  agenticInsight: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  priceValue?: number; // Numeric value for calculations
  description: string;
  longDescription?: string; // Detailed description for the product page
  features?: string[]; // List of specific deliverables/features
  icon?: React.ReactNode; // Optional in storage, rendered dynamically if missing
  iconName?: string; // For storage serialization
  rating?: number;
  tags?: string[];
  gradient?: string;
  configType?: 'marketing' | 'saas' | 'asset' | 'generic';
  status?: 'live' | 'draft';
  imageUrl?: string; // URL for product image
}

// --- Dashboard & Production Types ---

export type OrderStatus = 'queued' | 'analyzing' | 'building' | 'review' | 'completed' | 'cancelled' | 'denied';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'client' | 'admin';
  companyName?: string;
  joinedAt?: string;
  preferences?: {
    emailNotifications: boolean;
    slackIntegration: boolean;
  };
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  title: string;
  status: OrderStatus;
  progress: number; // 0-100
  createdAt: string;
  eta?: string;
  briefUrl?: string;
  thumbnailUrl?: string;
  unreadMessagesCount: number;
  totalValue?: number;
  
  // New Dynamic Data Fields
  items?: ProductItem[]; 
  configurations?: Record<number, Record<string, string>>;
  type?: 'standard' | 'proposal';
  notes?: string;
}

export interface Asset {
  id: string;
  orderId: string;
  name: string;
  type: 'image' | 'code' | 'document' | 'archive';
  url: string;
  size: string;
  uploadedBy: 'client' | 'admin';
  uploadedAt: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  attachments?: Asset[];
}

export interface TimelineEvent {
  id: string;
  orderId: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
}

export interface Revision {
  id: string;
  orderId: string;
  roundNumber: number;
  name: string;
  status: 'draft' | 'awaiting_review' | 'approved' | 'changes_requested';
  feedback?: string;
  deliveryDate: string;
  items: Asset[];
}

export interface ActivityLog {
  id: string;
  orderId: string;
  action: string;
  actorName: string;
  actorRole: 'client' | 'admin' | 'system';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DashboardState {
  user: UserProfile | null;
  orders: Order[];
  activeOrderId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Checkout Types ---

export interface CheckoutFormData {
  projectName: string;
  projectDescription: string;
  contactName: string;
  contactEmail: string;
  contactPassword?: string; // Optional for account creation
  createAccount: boolean;
  files: File[];
  configurations: Record<number, Record<string, string>>;
}

export interface AiSuggestion {
  featureName: string;
  reasoning: string;
}

export interface AutofillConfig {
  itemId: number;
  config: Record<string, string>;
}

// --- Admin Specific Types ---

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  type: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
  messages: Message[];
}

export interface Payment {
  id: string;
  orderId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  date: string;
  method: string;
}