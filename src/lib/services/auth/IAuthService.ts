/**
 * Abstract authentication service interface.
 * Supports dual auth methods: phone/OTP and email/password.
 * Implement this interface to swap auth providers without changing app code.
 */

import type { User } from '@/lib/types';

export interface AuthResult {
  user: User;
  token: string;
  expiresAt: number; // Unix timestamp (ms)
}

export interface IAuthService {
  // Phone / OTP
  sendOTP(phoneNumber: string): Promise<{ success: boolean }>;
  verifyOTP(phoneNumber: string, otp: string): Promise<AuthResult>;

  // Email / password
  signInWithEmail(email: string, password: string): Promise<AuthResult>;
  registerWithEmail(email: string, password: string, name: string): Promise<AuthResult>;
  resetPassword(email: string): Promise<{ success: boolean }>;

  // Account linking
  linkPhoneToAccount(phoneNumber: string): Promise<void>;
  linkEmailToAccount(email: string, password: string): Promise<void>;

  // Session
  getCurrentUser(): Promise<User | null>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void; // returns unsubscribe fn
}
