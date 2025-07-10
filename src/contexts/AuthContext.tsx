import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../types';

// Define the list of admin emails
const ADMIN_EMAILS = [
  'dasariyashasvi@gmail.com',
  // Add new admin emails here, e.g.:
  // 'newadmin1@example.com',
  // 'newadmin2@example.com',
];

interface AuthContextType {
  currentUser: User | null;
  role: 'admin' | 'user' | null; // Added role to interface
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null); // Added role state
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;
    const initializeAuth = async () => {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser && !isGuest) {
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            role: ADMIN_EMAILS.includes(firebaseUser.email || '') ? 'admin' : 'user', // Check against ADMIN_EMAILS
            createdAt: new Date(),
            photoURL: firebaseUser.photoURL, // Keep as is, will be undefined if not present
          };
          setCurrentUser(userData);
          setRole(userData.role); // Set role state
        } else {
          setCurrentUser(null);
          setRole(null); // Clear role when no user
        }
        setLoading(false);
      });
    };
    initializeAuth();
    return () => unsubscribe?.();
  }, [isGuest]);

  useEffect(() => {
    if (currentUser && !isGuest) {
      // Filter out undefined photoURL or set to null explicitly
      const cleanUserData = { ...currentUser, photoURL: currentUser.photoURL || null };
      setDoc(doc(db, 'users', currentUser.uid), cleanUserData, { merge: true }).catch((error) => {
        console.error('Firestore update error:', error);
      });
    }
  }, [currentUser, isGuest]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData: User = {
      uid: userCredential.user.uid,
      email,
      displayName,
      role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user', // Check against ADMIN_EMAILS
      createdAt: new Date(),
      photoURL: null, // Default to null if not provided
    };
    await setDoc(doc(db, 'users', userCredential.user.uid), userData, { merge: true });
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsGuest(false);
    setRole(null); // Clear role on logout
  };

  const setGuestMode = (isGuest: boolean) => {
    setIsGuest(isGuest);
    if (isGuest) {
      setCurrentUser(null);
      setRole(null); // Clear role in guest mode
    }
  };

  const value = {
    currentUser,
    role, // Include role in context
    loading,
    login,
    register,
    logout,
    googleLogin,
    setGuestMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};