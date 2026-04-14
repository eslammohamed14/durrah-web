'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import type { IAuthService } from '@/lib/services/auth/IAuthService';

// ── Types ──────────────────────────────────────────────────────────────────────

interface RegisterData {
  name: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'phoneNumber'>>) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
  /** Injected auth service — defaults to the configured provider from services.ts */
  authService?: IAuthService;
}

export function AuthProvider({ children, authService: injectedService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<IAuthService | null>(injectedService ?? null);

  // Lazily load the auth service if not injected
  useEffect(() => {
    if (injectedService) return;
    import('@/config/services').then(({ getAuthService }) => {
      getAuthService().then((svc) => setService(svc));
    });
  }, [injectedService]);

  // Subscribe to auth state changes once the service is ready
  useEffect(() => {
    if (!service) return;

    const unsubscribe = service.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [service]);

  // ── Auth actions ─────────────────────────────────────────────────────────────

  const sendOTP = useCallback(async (phoneNumber: string) => {
    if (!service) throw new Error('Auth service not ready');
    await service.sendOTP(phoneNumber);
  }, [service]);

  const loginWithOTP = useCallback(async (phoneNumber: string, otp: string) => {
    if (!service) throw new Error('Auth service not ready');
    const result = await service.verifyOTP(phoneNumber, otp);
    setUser(result.user);
  }, [service]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    if (!service) throw new Error('Auth service not ready');
    const result = await service.signInWithEmail(email, password);
    setUser(result.user);
  }, [service]);

  const register = useCallback(async (data: RegisterData) => {
    if (!service) throw new Error('Auth service not ready');
    if (data.email && data.password) {
      const result = await service.registerWithEmail(data.email, data.password, data.name);
      setUser(result.user);
    } else if (data.phoneNumber) {
      // Phone registration: OTP was already sent; verifyOTP completes registration
      throw new Error('Call sendOTP first, then loginWithOTP to complete phone registration');
    } else {
      throw new Error('Either email+password or phoneNumber is required for registration');
    }
  }, [service]);

  const logout = useCallback(async () => {
    if (!service) throw new Error('Auth service not ready');
    await service.signOut();
    setUser(null);
  }, [service]);

  const updateProfile = useCallback(async (
    _data: Partial<Pick<User, 'name' | 'email' | 'phoneNumber'>>
  ) => {
    // Profile updates go through the backend API (user endpoint).
    // The auth service itself doesn't expose a generic updateProfile —
    // this is a placeholder that callers can extend.
    throw new Error('updateProfile: use the API client to update user profile data');
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.roles.includes(role) ?? false;
  }, [user]);

  // ── Value ─────────────────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    loading,
    loginWithOTP,
    loginWithEmail,
    register,
    logout,
    updateProfile,
    hasRole,
    sendOTP,
    resetPassword: async (email: string) => {
      if (!service) throw new Error('Auth service not ready');
      await service.resetPassword(email);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
