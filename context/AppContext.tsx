import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ServiceProject, ServiceRequest, CartItem, User, Client, ClientLog, Sale, PaymentConfig, Appointment } from '../types';
import { db, auth } from '../firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';

interface AppContextType {
  // Products
  products: Product[];
  productCategories: string[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: (isOpen: boolean) => void;
  recordSale: (saleData: Omit<Sale, 'id' | 'date' | 'status'>) => void;
  
  // Requests
  serviceRequests: ServiceRequest[];
  addServiceRequest: (request: ServiceRequest) => void;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;

  // Projects
  projects: ServiceProject[];
  addProject: (project: ServiceProject) => void;
  updateProject: (project: ServiceProject) => void;
  deleteProject: (id: string) => void;
  
  // Auth & Users
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (user: Omit<User, 'id' | 'role'>) => Promise<boolean>;
  logout: () => void;
  users: User[];
  grantAdminRole: (email: string) => Promise<boolean>;

  // CRM (Clients)
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addClientLog: (clientId: string, log: ClientLog) => void;
  updateClientLogStatus: (clientId: string, logId: string, status: 'paid' | 'pending') => void;

  // Agenda / Appointments
  appointments: Appointment[];
  addAppointment: (apt: Appointment) => void;
  updateAppointment: (apt: Appointment) => void;
  deleteAppointment: (id: string) => void;

  // Admin Config & Sales
  sales: Sale[];
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (config: PaymentConfig) => void;
  isShopEnabled: boolean;
  toggleShop: (enabled: boolean) => void;

  // Hero Config
  heroImages: string[];
  updateHeroImages: (images: string[]) => void;

  // Auth UI
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Navigation
  currentPage: string;
  navigateTo: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
    alias: 'LUCAS.SEVERINO.MP',
    holderName: 'Lucas Severino'
};
const DEFAULT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1599687267812-35905d212787?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1628518973693-195b00c929a0?auto=format&fit=crop&w=1920&q=80', 
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1920&q=80',
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<ServiceProject[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>(['Plantas', 'Macetas', 'Tierra', 'Herramientas']);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Config States
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [heroImages, setHeroImages] = useState<string[]>(DEFAULT_HERO_IMAGES);
  const [isShopEnabled, setIsShopEnabled] = useState<boolean>(true);

  // Auth & UI State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('/');

  // --- FIREBASE LISTENERS ---

  // 1. Products (Public Read)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      setProducts(prods);
    }, (error) => console.error("Error products:", error));
    return () => unsubscribe();
  }, []);

  // 2. Projects (Public Read)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ServiceProject)));
    }, (error) => console.error("Error projects:", error));
    return () => unsubscribe();
  }, []);

  // 3. Categories
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'categories'), (docSnap) => {
        if (docSnap.exists()) {
            setProductCategories(docSnap.data().list || []);
        }
    }, (error) => console.log("Error config categories"));
    return () => unsubscribe();
  }, []);

  // 4. Protected Collections (Requires User)
  useEffect(() => {
      if (!currentUser) {
          // Limpiar datos sensibles si no hay usuario
          setServiceRequests([]);
          setClients([]);
          setAppointments([]);
          setSales([]);
          setUsers([]);
          return;
      }

      const unsubRequests = onSnapshot(collection(db, 'serviceRequests'), s => setServiceRequests(s.docs.map(d => ({...d.data(), id: d.id} as ServiceRequest))));
      const unsubClients = onSnapshot(collection(db, 'clients'), s => setClients(s.docs.map(d => ({...d.data(), id: d.id} as Client))));
      const unsubAppts = onSnapshot(collection(db, 'appointments'), s => setAppointments(s.docs.map(d => ({...d.data(), id: d.id} as Appointment))));
      const unsubSales = onSnapshot(collection(db, 'sales'), s => setSales(s.docs.map(d => ({...d.data(), id: d.id} as Sale))));
      const unsubUsers = onSnapshot(collection(db, 'users'), s => setUsers(s.docs.map(d => ({...d.data(), id: d.id} as User))));

      return () => {
          unsubRequests();
          unsubClients();
          unsubAppts();
          unsubSales();
          unsubUsers();
      };
  }, [currentUser?.id]);

  // 5. Config General
  useEffect(() => {
      const unsub = onSnapshot(doc(db, 'config', 'general'), (docSnap) => {
          if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.paymentConfig) setPaymentConfig(data.paymentConfig);
              if (data.heroImages) setHeroImages(data.heroImages);
              if (data.isShopEnabled !== undefined) setIsShopEnabled(data.isShopEnabled);
          }
      });
      return () => unsub();
  }, []);

  // 6. LÓGICA DE AUTENTICACIÓN ESTRICTA
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            try {
                // Buscamos el documento del usuario en la colección 'users' usando el UID
                // NO usamos displayName ni email split. Solo lo que está en la base de datos.
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data() as User;
                    
                    // REGLA DE ORO: Forzar Admin para ssamaniego065@gmail.com
                    // Esto asegura acceso al panel incluso si la DB dice 'user'
                    if (userData.email === 'ssamaniego065@gmail.com') {
                        userData.role = 'admin';
                    }

                    // Establecemos el usuario SOLO si existe en la DB
                    setCurrentUser({
                        ...userData,
                        id: firebaseUser.uid // Aseguramos que el ID coincida
                    });
                } else {
                    console.error("Usuario autenticado en Firebase pero no encontrado en Firestore (colección users).");
                    // Opcional: Cerrar sesión si hay inconsistencia de datos
                    // await signOut(auth);
                    // setCurrentUser(null);
                }
            } catch (error) {
                console.error("Error leyendo datos del usuario:", error);
            }
        } else {
            setCurrentUser(null);
        }
    });
    return () => unsubscribe();
  }, []);


  // --- AUTH ACTIONS ---

  const safeWrite = async (operation: () => Promise<any>) => {
      if (!currentUser) {
          alert("Debes iniciar sesión.");
          return;
      }
      try {
          await operation();
      } catch (e: any) {
          console.error("Error escritura:", e);
          alert("Error al guardar: " + e.message);
      }
  };

  const login = async (email: string, pass: string) => {
      try {
          await signInWithEmailAndPassword(auth, email, pass);
          setIsAuthModalOpen(false);
          return true;
      } catch (e) {
          console.error(e);
          return false;
      }
  };

  const register = async (userData: Omit<User, 'id' | 'role'>) => {
      try {
          // 1. Crear usuario en Firebase Auth
          const userCred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
          
          // 2. Crear documento en Firestore 'users' CON LOS DATOS DEL FORMULARIO
          // Aquí es donde guardamos tu Nombre y Apellido reales.
          const newUser: User = {
              id: userCred.user.uid,
              email: userData.email,
              name: userData.name,       // Nombre del input
              surname: userData.surname, // Apellido del input
              password: '***',           // No guardamos la pass real
              role: 'user'               // Por defecto user
          };
          
          // Forzar admin si es el email maestro durante el registro también
          if (newUser.email === 'ssamaniego065@gmail.com') {
              newUser.role = 'admin';
          }

          // Guardar en DB usando el UID como ID del documento
          await setDoc(doc(db, 'users', userCred.user.uid), newUser);
          
          setIsAuthModalOpen(false);
          return true;
      } catch (e) {
          console.error("Error registro:", e);
          return false;
      }
  };

  const logout = async () => {
      await signOut(auth);
      setCurrentUser(null); // Limpieza inmediata del estado local
      navigateTo('/');
  };

  const grantAdminRole = async (email: string) => {
      if(currentUser?.role !== 'admin') return false;
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), { role: 'admin' });
            return true;
        }
      } catch(e) { console.error(e); }
      return false;
  };

  // --- ACTIONS (Wrappers) ---
  const navigateTo = (path: string) => { setCurrentPage(path); window.scrollTo(0, 0); setIsCartOpen(false); };
  const toggleCart = (isOpen: boolean) => setIsCartOpen(isOpen);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // CRUD
  const addProduct = (p: Product) => safeWrite(async () => { const ref = doc(collection(db, 'products')); await setDoc(ref, { ...p, id: ref.id }); });
  const updateProduct = (p: Product) => safeWrite(async () => await setDoc(doc(db, 'products', p.id), p));
  const deleteProduct = (id: string) => safeWrite(async () => await deleteDoc(doc(db, 'products', id)));
  
  const addCategory = (c: string) => {
      const newList = [...productCategories, c];
      setProductCategories(newList);
      safeWrite(async () => await setDoc(doc(db, 'config', 'categories'), { list: newList }));
  };
  const deleteCategory = (c: string) => {
      const newList = productCategories.filter(cat => cat !== c);
      setProductCategories(newList);
      safeWrite(async () => await setDoc(doc(db, 'config', 'categories'), { list: newList }));
  };

  const addProject = (p: ServiceProject) => safeWrite(async () => { const ref = doc(collection(db, 'projects')); await setDoc(ref, { ...p, id: ref.id }); });
  const updateProject = (p: ServiceProject) => safeWrite(async () => await setDoc(doc(db, 'projects', p.id), p));
  const deleteProject = (id: string) => safeWrite(async () => await deleteDoc(doc(db, 'projects', id)));

  const addServiceRequest = (r: ServiceRequest) => safeWrite(async () => { const ref = await addDoc(collection(db, 'serviceRequests'), r); await updateDoc(ref, { id: ref.id }); });
  const updateServiceRequestStatus = (id: string, s: ServiceRequest['status']) => safeWrite(async () => await updateDoc(doc(db, 'serviceRequests', id), { status: s }));

  // Cart
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...p, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  
  const recordSale = (saleData: Omit<Sale, 'id' | 'date' | 'status'>) => {
      safeWrite(async () => {
        const newSale = { id: '', date: new Date().toISOString(), status: 'pending_payment', ...saleData };
        const ref = await addDoc(collection(db, 'sales'), newSale);
        await updateDoc(ref, { id: ref.id });
      });
  };

  // CRM & Agenda
  const addClient = (c: Client) => safeWrite(async () => { const ref = await addDoc(collection(db, 'clients'), c); await updateDoc(ref, { id: ref.id }); });
  const updateClient = (c: Client) => safeWrite(async () => await setDoc(doc(db, 'clients', c.id), c));
  const deleteClient = (id: string) => safeWrite(async () => await deleteDoc(doc(db, 'clients', id)));
  
  const addClientLog = (clientId: string, log: ClientLog) => {
      const client = clients.find(c => c.id === clientId);
      if(client) {
          const updated = { ...client, logs: [log, ...client.logs], totalEarnings: client.totalEarnings + (log.status==='paid'?log.amount:0), lastPrice: log.amount>0?log.amount:client.lastPrice };
          updateClient(updated);
      }
  };
  const updateClientLogStatus = (clientId: string, logId: string, status: 'paid' | 'pending') => {
      const client = clients.find(c => c.id === clientId);
      if(client) {
        const log = client.logs.find(l => l.id === logId);
        if(log) {
            let diff = 0;
            if(log.status==='pending' && status==='paid') diff = log.amount;
            if(log.status==='paid' && status==='pending') diff = -log.amount;
            const updatedLogs = client.logs.map(l => l.id === logId ? {...l, status} : l);
            updateClient({...client, logs: updatedLogs, totalEarnings: client.totalEarnings + diff});
        }
      }
  };

  const addAppointment = (a: Appointment) => safeWrite(async () => { const ref = await addDoc(collection(db, 'appointments'), a); await updateDoc(ref, { id: ref.id }); });
  const updateAppointment = (a: Appointment) => safeWrite(async () => await setDoc(doc(db, 'appointments', a.id), a));
  const deleteAppointment = (id: string) => safeWrite(async () => await deleteDoc(doc(db, 'appointments', id)));

  const updatePaymentConfig = (c: PaymentConfig) => safeWrite(async () => { setPaymentConfig(c); await updateDoc(doc(db, 'config', 'general'), { paymentConfig: c }); });
  const updateHeroImages = (i: string[]) => safeWrite(async () => { setHeroImages(i); await updateDoc(doc(db, 'config', 'general'), { heroImages: i }); });
  const toggleShop = (e: boolean) => safeWrite(async () => { setIsShopEnabled(e); await updateDoc(doc(db, 'config', 'general'), { isShopEnabled: e }); });

  return (
    <AppContext.Provider value={{
      products, productCategories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory,
      projects, addProject, updateProject, deleteProject,
      cart, addToCart, removeFromCart, clearCart, isCartOpen, toggleCart, recordSale,
      serviceRequests, addServiceRequest, updateServiceRequestStatus,
      currentUser, login, register, logout, users, grantAdminRole,
      clients, addClient, updateClient, deleteClient, addClientLog, updateClientLogStatus,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      sales, paymentConfig, updatePaymentConfig, isShopEnabled, toggleShop,
      heroImages, updateHeroImages,
      isAuthModalOpen, openAuthModal, closeAuthModal,
      currentPage, navigateTo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};