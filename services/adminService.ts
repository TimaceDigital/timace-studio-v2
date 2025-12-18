import { Order, ProductItem, UserProfile, SupportTicket, Payment, Project } from '../types';
import { 
  getAllOrders, subscribeToDataChanges, updateOrderInDb,
  getAllProducts, saveProductToDb, deleteProductFromDb,
  getAllBuilds, saveBuildToDb, deleteBuildFromDb
} from './authService';

export const fetchAllOrders = async (): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return getAllOrders();
};

export const onOrderUpdate = (callback: () => void) => {
  return subscribeToDataChanges(callback);
};

export const fetchAllClients = async (): Promise<UserProfile[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const fetchAllSupportTickets = async (): Promise<SupportTicket[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const fetchAllPayments = async (): Promise<Payment[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const realOrders = getAllOrders();
  const order = realOrders.find(o => o.id === orderId);
  if (order) {
    updateOrderInDb({ ...order, status: status as any });
  }
  return true;
};

// --- Product Management Wrappers ---

export const fetchProducts = async (): Promise<ProductItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getAllProducts();
};

export const createProduct = async (product: Partial<ProductItem>): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newProduct = {
    ...product,
    id: product.id || `prod_${Date.now()}`,
    status: product.status || 'draft'
  } as ProductItem;
  saveProductToDb(newProduct);
  return true;
};

export const updateProduct = async (id: string, product: Partial<ProductItem>): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const existing = getAllProducts().find(p => p.id === id);
  if (existing) {
    saveProductToDb({ ...existing, ...product });
  }
  return true;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  deleteProductFromDb(id);
  return true;
};

// --- Build Management Wrappers ---

export const fetchBuilds = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getAllBuilds();
};

export const createBuild = async (project: Partial<Project>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newBuild = {
      ...project,
      id: project.id || `build_${Date.now()}`,
      status: project.status || 'draft'
    } as Project;
    saveBuildToDb(newBuild);
    return true;
};

export const updateBuild = async (id: string, project: Partial<Project>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const existing = getAllBuilds().find(b => b.id === id);
    if (existing) {
      saveBuildToDb({ ...existing, ...project });
    }
    return true;
};

export const deleteBuild = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  deleteBuildFromDb(id);
  return true;
};

export const respondToTicket = async (ticketId: string, message: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
};