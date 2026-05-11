'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  userData: any | null;
  tasks: any[];
  insights: any[];
  notifications: any[];
  error: string | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  userData: null,
  tasks: [],
  insights: [],
  notifications: [],
  error: null,
  loading: true,
});

export const useFirebase = () => useContext(FirebaseContext);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Ensure user record exists
        const userRef = doc(db, 'users', authUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const newUser = {
              userId: authUser.uid,
              name: authUser.displayName || 'Architect',
              email: authUser.email,
              plan: 'free',
              pScore: 88,
              notifications: {
                taskReminders: true,
                aiInsights: true
              },
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(userRef, newUser);
            setUserData(newUser);
          } else {
            setUserData(userSnap.data());
          }
        } catch (err: any) {
          console.error("Error fetching/initializing user:", err);
          setError(err.message);
        }
        setUser(authUser);
      } else {
        setUser(null);
        setUserData(null);
        setTasks([]);
        setInsights([]);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    }, (err) => {
      if (auth.currentUser) {
        setError(err.message);
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      }
    });

    const qTasks = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTasks = onSnapshot(qTasks, (snap) => {
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      // Only report if still logged in to avoid race conditions on logout
      if (auth.currentUser) {
        setError(err.message);
        handleFirestoreError(err, OperationType.LIST, 'tasks');
      }
    });

    const qInsights = query(
      collection(db, 'insights'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeInsights = onSnapshot(qInsights, (snap) => {
      setInsights(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      if (auth.currentUser) {
        setError(err.message);
        handleFirestoreError(err, OperationType.LIST, 'insights');
      }
    });

    const qNotifications = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeNotifications = onSnapshot(qNotifications, (snap) => {
      setNotifications(snap.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        };
      }));
    }, (err) => {
      if (auth.currentUser) {
        setError(err.message);
        handleFirestoreError(err, OperationType.LIST, 'notifications');
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeTasks();
      unsubscribeInsights();
      unsubscribeNotifications();
    };
  }, [user]);

  return (
    <FirebaseContext.Provider value={{ user, userData, tasks, insights, notifications, error, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}
