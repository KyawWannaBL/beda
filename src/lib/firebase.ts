import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "britium-express-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "britium-express-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "britium-express-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Only connect if not already connected
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  } catch (error) {
    // Already connected
  }
  
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Already connected
  }
  
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    // Already connected
  }
  
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    // Already connected
  }
}

// Auth configuration
auth.useDeviceLanguage();

// Custom claims interface for role-based access
export interface CustomClaims {
  role: string;
  permissions: string[];
  isActive: boolean;
}

// Helper function to get user role from custom claims
export const getUserRole = async (user: any) => {
  if (!user) return null;
  
  try {
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Helper function to check if user has specific permission
export const hasPermission = async (user: any, permission: string) => {
  if (!user) return false;
  
  try {
    const idTokenResult = await user.getIdTokenResult();
    const permissions = idTokenResult.claims.permissions || [];
    return permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Temporary password configuration
export const TEMP_PASSWORD_CONFIG = {
  defaultPassword: 'TempPass123!',
  mustChangeAfterDays: 1,
  minPasswordLength: 8,
  requireSpecialChars: true,
  requireNumbers: true,
  requireUppercase: true
};

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  APP_OWNER: 100,
  SUPER_ADMIN: 90,
  FINANCE_ADMIN: 80,
  OPERATIONS_ADMIN: 80,
  MARKETING_ADMIN: 80,
  CUSTOMER_SERVICE_ADMIN: 80,
  SUP: 70,
  SSM: 60,
  WH: 50,
  DES: 40,
  RDR: 30,
  SSR: 30,
  ANALYST: 25,
  FINANCE_USER: 20,
  MARKETING: 20,
  CUSTOMER_SERVICE: 20,
  MERCHANT: 15,
  CUSTOMER: 10
};

// Check if user has higher or equal role level
export const hasRoleLevel = (userRole: string, requiredRole: string) => {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
};

export default app;