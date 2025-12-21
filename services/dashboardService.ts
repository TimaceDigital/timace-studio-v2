import { Order, Asset, Message, TimelineEvent, UserProfile, Revision, ActivityLog, ProductItem } from '../types';
import { db, functions } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

// Service layer to handle API interaction with Firestore

export const createStripeCheckoutSession = async (product: ProductItem, buildConfiguration: any) => {
  const createCheckout = httpsCallable(functions, 'createCheckoutSession');
  const result = await createCheckout({ product, buildConfiguration });
  return result.data as { sessionId: string, url: string };
};

export const fetchOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, "clientOrders"), where("clientId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const fetchAssets = async (orderId: string): Promise<Asset[]> => {
  const q = query(collection(db, "assets"), where("orderId", "==", orderId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
};

export const fetchMessages = async (orderId: string): Promise<Message[]> => {
  const q = query(collection(db, "messages"), where("orderId", "==", orderId), orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
};

export const subscribeToMessages = (orderId: string, callback: (messages: Message[]) => void) => {
  const q = query(collection(db, "messages"), where("orderId", "==", orderId), orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    callback(messages);
  });
};

export const sendMessage = async (orderId: string, senderId: string, senderName: string, content: string, isAdmin: boolean = false): Promise<Message> => {
  const messageData = {
    orderId,
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString(),
    isAdmin
  };
  const docRef = await addDoc(collection(db, "messages"), messageData);
  return { id: docRef.id, ...messageData } as Message;
};

export const fetchTimeline = async (orderId: string): Promise<TimelineEvent[]> => {
  const q = query(collection(db, "timelines"), where("orderId", "==", orderId), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
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
  }

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
};

export const fetchRevisions = async (orderId: string): Promise<Revision[]> => {
  const q = query(collection(db, "revisions"), where("orderId", "==", orderId), orderBy("roundNumber", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Revision));
};

export const fetchActivityLog = async (orderId: string): Promise<ActivityLog[]> => {
  // Logs could be stored in a subcollection or root collection
  // For now, let's just return a placeholder or implement real fetching if we decide to store logs
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

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { userId: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

// Client Builds (The private progress tracker)
export const subscribeToClientBuild = (orderId: string, callback: (build: any) => void) => {
  const q = query(collection(db, "clientBuilds"), where("orderId", "==", orderId));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    } else {
      callback(null);
    }
  });
};
