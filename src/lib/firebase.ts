import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Initialize Analytics if supported in the browser environment
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics unsupported in current environment, ignore
      });
    }
  } catch (err) {
    console.warn('[OnlyLuxe] Firebase initialization fallback to local storage:', err);
  }
}

/**
 * Upload an image file to Firebase Storage under the 'onlyluxe/products' path
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Թույլատրվում են միայն նկարներ (JPEG, PNG, WEBP, AVIF):');
  }

  // Validate file size (max 8MB)
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Նկարի ծավալը չպետք է գերազանցի 8 ՄԲ-ը:');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storageRef = ref(storage, `onlyluxe/products/${Date.now()}_${cleanFileName}`);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return getDownloadURL(snapshot.ref);
}

export { app, auth, db, storage, analytics };
