/**
 * Service interface types for the Durrah Property Management Platform.
 * All external services are accessed through these abstract interfaces
 * to allow provider swapping without changing application code.
 */

import type { User, Locale } from './index';

// ─── Auth Service ─────────────────────────────────────────────────────────────

export interface AuthResult {
  user: User;
  token: string;
  expiresAt: number; // Unix timestamp
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
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

// ─── Payment Service ──────────────────────────────────────────────────────────

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: 'succeeded' | 'failed' | 'processing';
  errorMessage?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

export interface IPaymentService {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<PaymentResult>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult>;
}

// ─── Map Service ──────────────────────────────────────────────────────────────

export interface MapConfig {
  accessToken: string;
  style?: string;
}

export interface MapOptions {
  center: Coordinates;
  zoom: number;
  interactive?: boolean;
}

// Opaque handle returned by createMap — consumers should not inspect internals
export interface MapInstance {
  readonly _mapInstanceBrand: unique symbol;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MarkerOptions {
  color?: string;
  popup?: string;
  draggable?: boolean;
}

export interface Marker {
  id: string;
  coordinates: Coordinates;
  remove(): void;
}

export interface IMapService {
  initialize(config: MapConfig): void;
  createMap(container: HTMLElement, options: MapOptions): MapInstance;
  addMarker(map: MapInstance, coordinates: Coordinates, options?: MarkerOptions): Marker;
  setCenter(map: MapInstance, coordinates: Coordinates, zoom?: number): void;
}

// ─── File Storage Service ─────────────────────────────────────────────────────

export interface IFileStorageService {
  uploadFile(file: File, path: string): Promise<{ url: string; id: string }>;
  deleteFile(id: string): Promise<void>;
  getFileUrl(id: string): Promise<string>;
}

// ─── Email Service ────────────────────────────────────────────────────────────

export type EmailTemplate =
  | 'booking_confirmation'
  | 'booking_cancellation'
  | 'inquiry_received'
  | 'inquiry_confirmation'
  | 'ticket_update'
  | 'password_reset';

export interface IEmailService {
  sendEmail(
    to: string,
    template: EmailTemplate,
    data: Record<string, unknown>
  ): Promise<{ success: boolean }>;
}
