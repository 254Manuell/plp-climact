"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: any;
  role: string | null;
  subscriptionStatus: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    console.log('[Auth] Fetching user session...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('[Auth] Error fetching user from Supabase:', userError.message);
      setUser(null);
      setRole(null);
      setSubscriptionStatus(null);
      setError(userError.message);
      setLoading(false);
      return;
    }
    if (user) {
      console.log('[Auth] User found:', user.id, user.email);
      setUser(user);
      // Fetch user role and subscription from DB
      const { data, error: dbError } = await supabase
        .from("users")
        .select("role, subscription_status")
        .eq("id", user.id)
        .single();
      if (dbError) {
        console.error('[Auth] Error fetching user role/subscription:', dbError.message);
        setRole(null);
        setSubscriptionStatus(null);
        setError(dbError.message);
      } else if (data) {
        console.log('[Auth] User role/subscription loaded:', data);
        setRole(data.role);
        setSubscriptionStatus(data.subscription_status);
      }
    } else {
      console.warn('[Auth] No user found. Session is missing or expired.');
      setUser(null);
      setRole(null);
      setSubscriptionStatus(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    await fetchUser();
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setSubscriptionStatus(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, subscriptionStatus, loading, error, login, logout, refresh: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
