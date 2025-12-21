import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserRole, ProductItem, Project } from "../types";

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: string;
}

// --- Auth ---

export const registerUser = async (email: string, pass: string, role: UserRole = 'client') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  
  // Create user document
  const userProfile: UserProfile = {
    userId: user.uid,
    email: user.email || "",
    role,
    createdAt: new Date().toISOString()
  };
  
  await setDoc(doc(db, "users", user.uid), userProfile);
  return user;
};

export const loginUser = async (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  return signOut(auth);
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// --- Products (Admin + Client) ---

// Real-time listener for products (Client side)
export const getLiveProducts = (callback: (products: ProductItem[]) => void) => {
  const q = query(collection(db, "products"), where("status", "!=", "archived"));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductItem));
    callback(products);
  });
};

// Admin: Get all products (including archived)
export const getAllProductsAdmin = (callback: (products: ProductItem[]) => void) => {
  return onSnapshot(collection(db, "products"), (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductItem));
    callback(products);
  });
};

export const addProduct = async (product: Omit<ProductItem, "id">) => {
  return addDoc(collection(db, "products"), product);
};

export const updateProduct = async (id: string, updates: Partial<ProductItem>) => {
  return updateDoc(doc(db, "products", id), updates);
};

export const deleteProduct = async (id: string) => {
  return deleteDoc(doc(db, "products", id));
};

// --- Showcase Builds (Admin + Public) ---

export const getShowcaseBuilds = (callback: (builds: Project[]) => void) => {
  const q = query(collection(db, "showcaseBuilds"), where("status", "==", "live"));
  return onSnapshot(q, (snapshot) => {
    const builds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    callback(builds);
  });
};

export const getAllShowcaseBuildsAdmin = (callback: (builds: Project[]) => void) => {
  return onSnapshot(collection(db, "showcaseBuilds"), (snapshot) => {
    const builds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    callback(builds);
  });
};

export const addShowcaseBuild = async (build: Omit<Project, "id">) => {
  return addDoc(collection(db, "showcaseBuilds"), build);
};

export const updateShowcaseBuild = async (id: string, updates: Partial<Project>) => {
  return updateDoc(doc(db, "showcaseBuilds", id), updates);
};

export const deleteShowcaseBuild = async (id: string) => {
  return deleteDoc(doc(db, "showcaseBuilds", id));
};
