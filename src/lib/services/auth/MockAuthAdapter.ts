'use client';

/**
 * No-op auth adapter for local development when Firebase (or another provider)
 * is not configured. Implements IAuthService with in-memory session state.
 */

import type { IAuthService, AuthResult } from './IAuthService';
import type { User } from '@/lib/types';

const defaultNotifications = {
  email: true,
  inApp: true,
  bookingUpdates: true,
  maintenanceUpdates: true,
  reviewAlerts: false,
  systemAlerts: true,
} as const;

function createDemoUser(partial: Partial<User> = {}): User {
  const now = new Date();
  return {
    id: 'mock-user',
    name: 'Demo User',
    email: 'demo@example.com',
    roles: ['guest'],
    authMethod: 'email',
    createdAt: now,
    updatedAt: now,
    preferences: {
      language: 'en',
      notifications: { ...defaultNotifications },
    },
    ...partial,
  };
}

export class MockAuthAdapter implements IAuthService {
  private user: User | null = null;
  private readonly listeners = new Set<(u: User | null) => void>();

  private notify(): void {
    for (const cb of this.listeners) cb(this.user);
  }

  async sendOTP(_phoneNumber: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async verifyOTP(phoneNumber: string, _otp: string): Promise<AuthResult> {
    const now = Date.now();
    this.user = createDemoUser({
      phoneNumber,
      authMethod: 'phone',
    });
    this.notify();
    return { user: this.user, token: 'mock-token', expiresAt: now + 86_400_000 };
  }

  async signInWithEmail(email: string, _password: string): Promise<AuthResult> {
    const now = Date.now();
    this.user = createDemoUser({ email, authMethod: 'email' });
    this.notify();
    return { user: this.user, token: 'mock-token', expiresAt: now + 86_400_000 };
  }

  async registerWithEmail(
    email: string,
    _password: string,
    name: string,
  ): Promise<AuthResult> {
    const now = Date.now();
    this.user = createDemoUser({ email, name, authMethod: 'email' });
    this.notify();
    return { user: this.user, token: 'mock-token', expiresAt: now + 86_400_000 };
  }

  async resetPassword(_email: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  async linkPhoneToAccount(_phoneNumber: string): Promise<void> {
    /* no-op */
  }

  async linkEmailToAccount(_email: string, _password: string): Promise<void> {
    /* no-op */
  }

  async getCurrentUser(): Promise<User | null> {
    return this.user;
  }

  async signOut(): Promise<void> {
    this.user = null;
    this.notify();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.add(callback);
    queueMicrotask(() => callback(this.user));
    return () => {
      this.listeners.delete(callback);
    };
  }
}
