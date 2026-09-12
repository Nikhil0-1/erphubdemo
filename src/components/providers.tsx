"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { syncUserProfile, UserProfileData, logoutUser } from "@/lib/firebase-auth";
import { UserRole } from "@/types";

type AuthContextType = {
  user: User | null;
  profile: UserProfileData | null;
  role: UserRole | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const userProfile = await syncUserProfile(currentUser);
      setProfile(userProfile);
    } catch {
      // If Firestore profile fetch fails (e.g. offline or rules pending), create local fallback
      setProfile({
        uid: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || "User",
        role: "STUDENT",
        status: "ACTIVE",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        await fetchProfile(u);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || null,
        loading,
        logout: handleLogout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
