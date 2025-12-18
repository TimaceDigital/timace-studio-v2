import { Order, Asset, Message, TimelineEvent, UserProfile, Revision, ActivityLog } from '../types';
import { getClientOrders, getSession } from './authService';

// Service layer to handle API interaction.
// Now connected to local persistence layer.

export const fetchOrders = async (): Promise<Order[]> => {
  const session = getSession();
  if (!session) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return getClientOrders(session.user.id);
};

export const fetchAssets = async (orderId: string): Promise<Asset[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return []; // Future: Persist assets
};

export const fetchMessages = async (orderId: string): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return []; // Future: Persist messages
};

export const fetchTimeline = async (orderId: string): Promise<TimelineEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  // Return default timeline for demo
  return [
    {
      id: 'evt-1',
      orderId,
      title: 'Order Placed',
      description: 'Project requirements received and queued for analysis.',
      status: 'completed',
      timestamp: 'Just now'
    },
    {
      id: 'evt-2',
      orderId,
      title: 'AI Analysis',
      description: 'Architect agents are reviewing the brief and generating technical specs.',
      status: 'current',
    }
  ];
};

export const fetchRevisions = async (orderId: string): Promise<Revision[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [];
};

export const fetchActivityLog = async (orderId: string): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
     {
        id: 'log-1',
        orderId,
        action: 'System Init',
        actorName: 'System',
        actorRole: 'system',
        timestamp: new Date().toISOString(),
        metadata: { version: '2.0' }
     }
  ];
};

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  const session = getSession();
  await new Promise(resolve => setTimeout(resolve, 300));
  return session ? session.user : null;
};

export const sendMessage = async (orderId: string, content: string): Promise<Message> => {
    // API call placeholder
    throw new Error("API not connected");
};

export const uploadAsset = async (orderId: string, file: File): Promise<Asset> => {
    // API call placeholder
    throw new Error("API not connected");
};