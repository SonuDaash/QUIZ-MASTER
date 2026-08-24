'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { getUserProfile, getStudentProfile, createUserProfile } from '@/lib/firebase/firestore';
import type { Profile, Student, UserRole } from '@/lib/types';

interface AuthContextType {
  user: Profile | null;
  student: Student | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  student: null,
  firebaseUser: null,
  loading: true,
  signOut: async () => {},
  updateUserRole: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFirebaseUser(authUser);
      if (!authUser) {
        setUser(null);
        setStudent(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(authUser.uid);
        if (profile) {
          setUser(profile);
          if (profile.role === 'student') {
            const studentData = await getStudentProfile(authUser.uid);
            setStudent(studentData);
          }
        } else {
          // Default profile if not exists
          const newProfile: Profile = {
            id: authUser.uid,
            name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            role: 'student',
            avatar_url: authUser.photoURL,
            created_at: new Date().toISOString(),
          };
          setUser(newProfile);
          await createUserProfile(authUser.uid, newProfile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setStudent(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!user) return;
    try {
      await createUserProfile(user.id, { role: newRole });
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, student, firebaseUser, loading, signOut, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}
