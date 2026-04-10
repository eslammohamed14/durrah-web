'use client';

/**
 * Firebase Authentication adapter implementing IAuthService.
 * Supports phone/OTP and email/password sign-in methods.
 *
 * NOTE: Firebase phone auth requires a RecaptchaVerifier which must be
 * initialised in the browser. The verifier is created lazily on first OTP send.
 */

import {
  getAuth,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  linkWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  type Auth,
  type ConfirmationResult,
  type User as FirebaseUser,
} from 'firebase/auth';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { IAuthService, AuthResult } from './IAuthService';
import type { User, UserRole, AuthMethod } from '@/lib/types';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId?: string;
  appId?: string;
}

// In-memory store for OTP confirmation results (keyed by phone number)
const confirmationResults = new Map<string, ConfirmationResult>();

function mapFirebaseUser(fbUser: FirebaseUser): User {
  const providerIds = fbUser.providerData.map((p: { providerId: string }) => p.providerId);
  const hasPhone = providerIds.includes('phone');
  const hasEmail = providerIds.includes('password');

  const authMethod: AuthMethod =
    hasPhone && hasEmail ? 'both' : hasPhone ? 'phone' : 'email';

  // Default role is 'guest'; real roles should come from custom claims / backend
  const roles: UserRole[] = ['guest'];

  return {
    id: fbUser.uid,
    email: fbUser.email ?? undefined,
    phoneNumber: fbUser.phoneNumber ?? undefined,
    name: fbUser.displayName ?? 'User',
    roles,
    authMethod,
    profileImage: fbUser.photoURL ?? undefined,
    createdAt: new Date(fbUser.metadata.creationTime ?? Date.now()),
    updatedAt: new Date(fbUser.metadata.lastSignInTime ?? Date.now()),
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        inApp: true,
        bookingUpdates: true,
        maintenanceUpdates: true,
        reviewAlerts: true,
        systemAlerts: true,
      },
    },
  };
}

async function getIdToken(fbUser: FirebaseUser): Promise<string> {
  return fbUser.getIdToken();
}

async function buildAuthResult(fbUser: FirebaseUser): Promise<AuthResult> {
  const token = await getIdToken(fbUser);
  // Firebase ID tokens expire after 1 hour
  const expiresAt = Date.now() + 60 * 60 * 1000;
  return { user: mapFirebaseUser(fbUser), token, expiresAt };
}

export class FirebaseAuthAdapter implements IAuthService {
  private auth: Auth;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor(config: FirebaseConfig) {
    const app: FirebaseApp = getApps().length
      ? getApp()
      : initializeApp(config);
    this.auth = getAuth(app);
  }

  // ── Phone / OTP ────────────────────────────────────────────────────────────

  async sendOTP(phoneNumber: string): Promise<{ success: boolean }> {
    if (typeof window === 'undefined') {
      throw new Error('sendOTP must be called in the browser');
    }

    // Create an invisible RecaptchaVerifier if not already present
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }

    const confirmation = await signInWithPhoneNumber(
      this.auth,
      phoneNumber,
      this.recaptchaVerifier
    );
    confirmationResults.set(phoneNumber, confirmation);
    return { success: true };
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResult> {
    const confirmation = confirmationResults.get(phoneNumber);
    if (!confirmation) {
      throw new Error('No OTP request found for this phone number. Please request a new OTP.');
    }
    const credential = await confirmation.confirm(otp);
    confirmationResults.delete(phoneNumber);
    return buildAuthResult(credential.user);
  }

  // ── Email / password ───────────────────────────────────────────────────────

  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return buildAuthResult(credential.user);
  }

  async registerWithEmail(email: string, password: string, name: string): Promise<AuthResult> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    return buildAuthResult(credential.user);
  }

  async resetPassword(email: string): Promise<{ success: boolean }> {
    await sendPasswordResetEmail(this.auth, email);
    return { success: true };
  }

  // ── Account linking ────────────────────────────────────────────────────────

  async linkPhoneToAccount(phoneNumber: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }

    const confirmation = await linkWithPhoneNumber(user, phoneNumber, this.recaptchaVerifier);
    confirmationResults.set(phoneNumber, confirmation);
  }

  async linkEmailToAccount(email: string, password: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const credential = EmailAuthProvider.credential(email, password);
    await linkWithCredential(user, credential);
  }

  // ── Session ────────────────────────────────────────────────────────────────

  async getCurrentUser(): Promise<User | null> {
    const fbUser = this.auth.currentUser;
    return fbUser ? mapFirebaseUser(fbUser) : null;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
    this.recaptchaVerifier = null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, (fbUser: FirebaseUser | null) => {
      callback(fbUser ? mapFirebaseUser(fbUser) : null);
    });
  }
}
