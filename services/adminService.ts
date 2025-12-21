import { Order, ProductItem, UserProfile, SupportTicket, Payment, Project } from '../types';
import { db } from './firebase';
import { 
  collection, query, getDocs, updateDoc, doc, 
  deleteDoc, addDoc, onSnapshot, orderBy
} from "firebase/firestore";

// --- Orders ---

export const fetchAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "clientOrders"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const onOrderUpdate = (callback: () => void) => {
  // Simple trigger for reloading lists, more granular in real apps
  // Returns unsubscribe function
  return onSnapshot(collection(db, "clientOrders"), () => callback());
};

export const approveOrder = async (orderId: string): Promise<void> => {
  const orderRef = doc(db, "clientOrders", orderId);
  await updateDoc(orderRef, {
    status: 'approved'
  });
};

export const denyOrder = async (orderId: string): Promise<void> => {
  const orderRef = doc(db, "clientOrders", orderId);
  await updateDoc(orderRef, {
    status: 'denied'
  });
};


export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  await updateDoc(doc(db, "clientOrders", orderId), { status });
  return true;
};

// --- Clients ---

export const fetchAllClients = async (): Promise<UserProfile[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() } as UserProfile));
};

// --- Payments (Placeholder, ideally from Stripe API via Functions) ---

export const fetchAllPayments = async (): Promise<Payment[]> => {
  // In a real app, you might sync Stripe payments to a 'payments' collection
  return [];
};

// --- Support (Placeholder) --- 

export const fetchAllSupportTickets = async (): Promise<SupportTicket[]> => {
  return [];
};

export const respondToTicket = async (ticketId: string, message: string): Promise<boolean> => {
    return true;
};
