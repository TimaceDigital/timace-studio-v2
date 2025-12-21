export const initializeApp = (config: any) => ({ 
  name: '[DEFAULT]',
  options: config,
  automaticDataCollectionEnabled: false 
});

export const getAuth = (app: any) => ({ app });
export const getFirestore = (app: any) => ({ app });
export const getFunctions = (app: any) => ({ app });

export const createUserWithEmailAndPassword = async () => ({ user: { uid: 'mock-uid', email: 'mock@test.com' } });
export const signInWithEmailAndPassword = async () => ({ user: { uid: 'mock-uid', email: 'mock@test.com' } });
export const signOut = async () => {};
export const onAuthStateChanged = (auth: any, callback: any) => callback(null);

export const doc = (db: any, col: string, id: string) => ({ path: `${col}/${id}` });
export const collection = (db: any, path: string) => ({ path });
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const setDoc = async () => {};
export const addDoc = async () => {};
export const updateDoc = async () => {};
export const deleteDoc = async () => {};
export const query = () => {};
export const where = () => {};
export const onSnapshot = () => () => {};

export const httpsCallable = () => async () => ({ data: {} });
