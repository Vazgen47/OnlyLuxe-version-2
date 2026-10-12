import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultProducts } from '../data/products';
import type {
  CartItem,
  CategoryRecord,
  ContactMessage,
  MessageStatus,
  OrderRecord,
  OrderStatus,
  Product,
  SiteSettings,
} from '../types';
import { db, isFirebaseConfigured, auth } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const STORAGE_CART = 'onlyluxe-cart';
const STORAGE_FAVORITES = 'onlyluxe-favorites';
const STORAGE_PRODUCTS = 'onlyluxe-products-v3';
const STORAGE_ORDERS = 'onlyluxe-orders-v2';
const STORAGE_MESSAGES = 'onlyluxe-messages';
const STORAGE_CATEGORIES = 'onlyluxe-categories';
const STORAGE_ADMIN_SESSION = 'onlyluxe-admin-session';
const STORAGE_SETTINGS = 'onlyluxe-settings-v2';

const defaultCategories: CategoryRecord[] = [
  {
    id: 'cat-watches',
    name: 'Ժամացույցներ',
    slug: 'watches',
    description: 'Շվեյցարական ավտոմատիկ մեխանիզմներ, սապֆիրե ապակի և բարձրագույն ճշգրտություն',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-bags',
    name: 'Պայուսակներ',
    slug: 'bags',
    description: '100% բնական իտալական կաշվից ձեռագործ կանացի և տղամարդու պայուսակներ',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-wallets',
    name: 'Դրամապանակներ',
    slug: 'wallets',
    description: 'Կոմպակտ, բարձրորակ դրամապանակներ RFID պաշտպանությամբ',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
  },
];

const defaultSettings: SiteSettings = {
  bannerNotice: '🎁 Բարձրակարգ շքեղ հավաքածու՝ անվճար ապահովագրված առաքում Երևանում',
  phoneContact: '055-31-61-91',
  instagramUrl: 'https://www.instagram.com/onlyluxe.evn/',
  telegramUrl: 'https://t.me/+sAs7VSzcRhhjOTFi',
  tiktokUrl: 'https://www.tiktok.com/@onlyluxe.evn',
  heroTitle: 'Շքեղության անժամանակ արվեստ',
  heroSubtitle: 'Բացառիկ շվեյցարական ժամացույցներ, բարձրակարգ կաշվե պայուսակներ և դրամապանակներ Երևանում',
  brandPresentation: 'OnlyLuxe × iCloneEvn',
  agencyCredit: 'Պատրաստված է Mkheyan Agency-ի կողմից',
  warrantyNotice: '2 տարվա պաշտոնական երաշխիք բոլոր ժամացույցների համար',
  deliveryNotice: 'Անվճար ապահովագրված առաքում Երևանում 2-4 ժամում',
  seoTitle: 'OnlyLuxe × iCloneEvn | Պրեմիում ժամացույցների և աքսեսուարների բուտիկ Երևանում',
  seoDescription: 'OnlyLuxe × iCloneEvn - Շքեղ շվեյցարական ժամացույցներ, բնական կաշվե պայուսակներ և դրամապանակներ Երևանում: Հեռ.` 055-31-61-91',
};

const readStoredArray = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const readStoredObject = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

type StoreContextValue = {
  products: Product[];
  favorites: number[];
  cart: CartItem[];
  orders: OrderRecord[];
  messages: ContactMessage[];
  categories: CategoryRecord[];
  adminSession: { email: string } | null;
  isAdminAuthenticated: boolean;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  addToCart: (productId: number, quantity?: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  setProducts: (value: Product[]) => void;
  upsertProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  upsertCategory: (category: CategoryRecord) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  addOrder: (order: OrderRecord) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => Promise<void>;
  sendMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMessageStatus: (id: string, status: MessageStatus) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
  isFirebaseActive: boolean;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(() =>
    readStoredArray<number>(STORAGE_FAVORITES, [])
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStoredArray<CartItem>(STORAGE_CART, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStoredArray<OrderRecord>(STORAGE_ORDERS, [])
  );
  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    readStoredArray<ContactMessage>(STORAGE_MESSAGES, [])
  );
  const [categories, setCategories] = useState<CategoryRecord[]>(() =>
    readStoredArray<CategoryRecord>(STORAGE_CATEGORIES, defaultCategories)
  );
  const [adminProducts, setAdminProducts] = useState<Product[]>(() =>
    readStoredArray<Product>(STORAGE_PRODUCTS, defaultProducts)
  );
  const [adminSession, setAdminSession] = useState<{ email: string } | null>(() =>
    readStoredObject<{ email: string } | null>(STORAGE_ADMIN_SESSION, null)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    readStoredObject<SiteSettings>(STORAGE_SETTINGS, defaultSettings)
  );

  // Firestore real-time listeners
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    // 1. Sync Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Product);
          });
          setAdminProducts(list);
        }
      },
      (error) => {
        console.warn('[OnlyLuxe] Firestore read products fallback to local:', error);
      }
    );

    // 2. Sync Orders
    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: OrderRecord[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as OrderRecord);
          });
          setOrders(list);
        }
      },
      () => {
        // Safe fallback on permission check if not logged in
      }
    );

    // 3. Sync Messages
    const unsubMessages = onSnapshot(
      query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ContactMessage[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as ContactMessage);
          });
          setMessages(list);
        }
      },
      () => {
        // Safe fallback on permission check if not logged in
      }
    );

    // 4. Sync Settings
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSiteSettings((prev) => ({ ...prev, ...(docSnap.data() as Partial<SiteSettings>) }));
        }
      },
      (error) => {
        console.warn('[OnlyLuxe] Firestore read settings fallback to local:', error);
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubMessages();
      unsubSettings();
    };
  }, []);

  // Sync state to local storage
  useEffect(() => {
    window.localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(adminProducts));
  }, [adminProducts]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ADMIN_SESSION, JSON.stringify(adminSession));
  }, [adminSession]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  const products = useMemo(() => adminProducts, [adminProducts]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === productId);
      if (existing) {
        return current.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { id: productId, quantity }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: number) => favorites.includes(productId),
    [favorites]
  );

  const setProducts = useCallback((value: Product[]) => {
    setAdminProducts(value);
  }, []);

  const upsertProduct = useCallback(
    async (product: Product) => {
      setAdminProducts((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id ? product : item
          );
        }
        return [product, ...current];
      });

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'products', String(product.id)), product);
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to write product to Firestore:', err);
        }
      }
    },
    []
  );

  const removeProduct = useCallback(
    async (productId: number) => {
      setAdminProducts((current) =>
        current.filter((product) => product.id !== productId)
      );

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, 'products', String(productId)));
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to delete product in Firestore:', err);
        }
      }
    },
    []
  );

  const upsertCategory = useCallback(
    async (category: CategoryRecord) => {
      setCategories((current) => {
        const existing = current.find((c) => c.id === category.id);
        if (existing) {
          return current.map((c) => (c.id === category.id ? category : c));
        }
        return [...current, category];
      });

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'categories', category.id), category);
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to write category to Firestore:', err);
        }
      }
    },
    []
  );

  const removeCategory = useCallback(
    async (categoryId: string) => {
      setCategories((current) => current.filter((c) => c.id !== categoryId));

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, 'categories', categoryId));
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to delete category in Firestore:', err);
        }
      }
    },
    []
  );

  const addOrder = useCallback(
    async (order: OrderRecord) => {
      setOrders((current) => [order, ...current]);

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'orders', order.id), order);
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to write order to Firestore:', err);
        }
      }
    },
    []
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus, adminNotes?: string) => {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
              }
            : order
        )
      );

      if (isFirebaseConfigured && db) {
        try {
          const payload: Partial<OrderRecord> = { status };
          if (adminNotes !== undefined) payload.adminNotes = adminNotes;
          await setDoc(doc(db, 'orders', orderId), payload, { merge: true });
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to update order in Firestore:', err);
        }
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      const id = `MSG-${Date.now().toString().slice(-6)}`;
      const now = new Date().toISOString();
      const newMsg: ContactMessage = {
        ...msg,
        id,
        status: 'new',
        createdAt: now,
        updatedAt: now,
      };

      setMessages((current) => [newMsg, ...current]);

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'contactMessages', id), newMsg);
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to write message to Firestore:', err);
        }
      }
    },
    []
  );

  const updateMessageStatus = useCallback(
    async (id: string, status: MessageStatus) => {
      const now = new Date().toISOString();
      setMessages((current) =>
        current.map((m) => (m.id === id ? { ...m, status, updatedAt: now } : m))
      );

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'contactMessages', id), { status, updatedAt: now }, { merge: true });
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to update message in Firestore:', err);
        }
      }
    },
    []
  );

  const deleteMessage = useCallback(
    async (id: string) => {
      setMessages((current) => current.filter((m) => m.id !== id));

      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, 'contactMessages', id));
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to delete message in Firestore:', err);
        }
      }
    },
    []
  );

  const updateSiteSettings = useCallback(
    async (settings: Partial<SiteSettings>) => {
      setSiteSettings((current) => ({ ...current, ...settings }));

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
        } catch (err) {
          console.warn('[OnlyLuxe] Failed to write settings to Firestore:', err);
        }
      }
    },
    []
  );

  const loginAdmin = useCallback((email: string) => {
    setAdminSession({ email });
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminSession(null);
    if (auth) {
      auth.signOut().catch(() => {});
    }
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      favorites,
      cart,
      orders,
      messages,
      categories,
      adminSession,
      isAdminAuthenticated: Boolean(adminSession),
      siteSettings,
      updateSiteSettings,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      setProducts,
      upsertProduct,
      removeProduct,
      upsertCategory,
      removeCategory,
      addOrder,
      updateOrderStatus,
      sendMessage,
      updateMessageStatus,
      deleteMessage,
      loginAdmin,
      logoutAdmin,
      isFirebaseActive: isFirebaseConfigured,
    }),
    [
      addOrder,
      addToCart,
      adminSession,
      cart,
      categories,
      clearCart,
      deleteMessage,
      favorites,
      isFavorite,
      loginAdmin,
      logoutAdmin,
      messages,
      orders,
      products,
      removeFromCart,
      removeCategory,
      removeProduct,
      sendMessage,
      setProducts,
      siteSettings,
      toggleFavorite,
      updateCartQuantity,
      updateMessageStatus,
      updateOrderStatus,
      updateSiteSettings,
      upsertCategory,
      upsertProduct,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
