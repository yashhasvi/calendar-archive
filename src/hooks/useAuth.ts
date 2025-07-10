import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

// Admin credentials
const ADMIN_CREDENTIALS = [
  { email: 'dasariyashasvi@gmail.com', password: '123456' },
  // Add more admin emails and passwords here
  { email: 'admin@calendararchive.com', password: 'admin123' },
  { email: 'manager@calendararchive.com', password: 'manager123' }
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        // Check if user is admin
        const isAdmin = ADMIN_CREDENTIALS.some(admin => admin.email === firebaseUser.email);
        
        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || userDoc.data().displayName,
            role: isAdmin ? 'admin' : (userDoc.data().role || 'user')
          });
        } else {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || 'User',
            role: isAdmin ? 'admin' : 'user'
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Check if new user should be admin
    const isAdmin = ADMIN_CREDENTIALS.some(admin => admin.email === email);
    
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: result.user.email!,
      displayName,
      role: isAdmin ? 'admin' : 'user'
    });
    return result;
  };

  const logout = () => signOut(auth);

  return { user, loading, login, register, logout };
};