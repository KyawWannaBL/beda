import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserRole, User as LegacyUser } from '@/lib/index';
import { toast } from 'sonner';

// User data interface matching Firestore rules
interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  companyName?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  profileComplete: boolean;
}

// Auth context interface
interface AuthContextType {
  user: User | null;  // Firebase User
  userData: UserData | null;
  legacyUser: LegacyUser | null;  // Backward compatibility
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<UserData>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  checkMustChangePassword: () => boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [legacyUser, setLegacyUser] = useState<LegacyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create legacy user object for backward compatibility
  const createLegacyUser = (firebaseUser: User | null, userData: UserData | null): LegacyUser | null => {
    if (!firebaseUser || !userData) return null;
    
    return {
      id: firebaseUser.uid,
      name: userData.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      role: userData.role,
      permissions: [],
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLoginAt,
      batchId: undefined
    };
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            
            // Update last login time
            await updateDoc(userDocRef, {
              lastLoginAt: new Date()
            });
          } else {
            // User document doesn't exist, create basic profile
            const basicUserData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'CUSTOMER' as UserRole, // Default role
              isActive: true,
              mustChangePassword: false,
              emailVerified: firebaseUser.emailVerified,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              profileComplete: false
            };
            
            await setDoc(userDocRef, basicUserData);
            setUserData(basicUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user profile');
        }
      } else {
        setUser(null);
        setUserData(null);
        setLegacyUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update legacy user when user or userData changes
  useEffect(() => {
    setLegacyUser(createLegacyUser(user, userData));
  }, [user, userData]);

  // Login function
  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      setIsLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data() as UserData;
      
      // Check if user is active
      if (!userData.isActive) {
        await signOut(auth);
        throw new Error('Account has been deactivated. Please contact support.');
      }
      
      // Check role if specified
      if (role && userData.role !== role) {
        await signOut(auth);
        throw new Error('Invalid role selected for this account');
      }
      
      // Check email verification for certain roles
      const requireEmailVerification = ['SUPER_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN'];
      if (requireEmailVerification.includes(userData.role) && !firebaseUser.emailVerified) {
        await signOut(auth);
        throw new Error('Email verification required for this role');
      }
      
      // Check temporary password
      if (userData.mustChangePassword) {
        // Don't sign out, but flag for password change
        toast.warning('You must change your password before continuing');
      }
      
      toast.success('Login successful');
      
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, signupData: Partial<UserData>) => {
    try {
      setIsLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore
      const userData: UserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: signupData.displayName || '',
        role: signupData.role || 'CUSTOMER' as UserRole,
        phoneNumber: signupData.phoneNumber,
        companyName: signupData.companyName,
        isActive: true,
        mustChangePassword: false,
        emailVerified: firebaseUser.emailVerified,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        profileComplete: true
      };
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, userData);
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      toast.success('Account created successfully. Please verify your email.');
      
    } catch (error: any) {
      setIsLoading(false);
      
      let errorMessage = 'Signup failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use at least 8 characters';
          break;
        default:
          errorMessage = error.message || 'Signup failed';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
      throw new Error(error.message);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Verify email function
  const verifyEmail = async () => {
    try {
      if (user) {
        await sendEmailVerification(user);
        toast.success('Verification email sent');
      }
    } catch (error: any) {
      toast.error('Failed to send verification email');
      throw new Error(error.message);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      // Update mustChangePassword flag in Firestore
      if (userData?.mustChangePassword) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          mustChangePassword: false
        });
        
        // Update local state
        setUserData(prev => prev ? { ...prev, mustChangePassword: false } : null);
      }
      
      toast.success('Password updated successfully');
      
    } catch (error: any) {
      let errorMessage = 'Failed to change password';
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Current password is incorrect';
          break;
        case 'auth/weak-password':
          errorMessage = 'New password is too weak';
          break;
        default:
          errorMessage = error.message || 'Failed to change password';
      }
      
      throw new Error(errorMessage);
    }
  };

  // Update user profile function
  const updateUserProfile = async (data: Partial<UserData>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, data);
      
      // Update local state
      setUserData(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Profile updated successfully');
      
    } catch (error: any) {
      toast.error('Failed to update profile');
      throw new Error(error.message);
    }
  };

  // Check if user must change password
  const checkMustChangePassword = () => {
    return userData?.mustChangePassword || false;
  };

  const value: AuthContextType = {
    user,
    userData,
    legacyUser,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    verifyEmail,
    changePassword,
    updateUserProfile,
    checkMustChangePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy hook for backward compatibility
export const useAuthContext = useAuth;