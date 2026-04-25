/**
 * Service factory configuration.
 * Instantiates the correct service adapter based on environment variables.
 * All external services are accessed through abstract interfaces to allow
 * provider swapping without changing application code.
 */

import { env } from './env';
import type { IAuthService } from '@/lib/services/auth/IAuthService';
import type { IPaymentService } from '@/lib/services/payment/IPaymentService';
import type { IMapService } from '@/lib/services/map/IMapService';
import type { IFileStorageService } from '@/lib/services/storage/IFileStorageService';

// Lazy singletons — instantiated on first access
let _authService: IAuthService | null = null;
let _paymentService: IPaymentService | null = null;
let _mapService: IMapService | null = null;
let _storageService: IFileStorageService | null = null;

export async function getAuthService(): Promise<IAuthService> {
  if (_authService) return _authService;

  const { MockAuthAdapter } = await import('@/lib/services/auth/MockAuthAdapter');
  _authService = new MockAuthAdapter();

  return _authService;
}

export async function getPaymentService(): Promise<IPaymentService> {
  if (_paymentService) return _paymentService;

  switch (env.paymentProvider) {
    case 'stripe': {
      const { StripePaymentAdapter } = await import('@/lib/services/payment/StripePaymentAdapter');
      _paymentService = new StripePaymentAdapter(env.stripe);
      break;
    }
    default:
      throw new Error(`Unknown payment provider: ${env.paymentProvider}`);
  }

  return _paymentService;
}

export async function getMapService(): Promise<IMapService> {
  if (_mapService) return _mapService;

  switch (env.mapProvider) {
    case 'mapbox': {
      const { MapboxAdapter } = await import('@/lib/services/map/MapboxAdapter');
      _mapService = new MapboxAdapter(env.mapbox);
      break;
    }
    default:
      throw new Error(`Unknown map provider: ${env.mapProvider}`);
  }

  return _mapService;
}

export async function getStorageService(): Promise<IFileStorageService> {
  if (_storageService) return _storageService;

  switch (env.storageProvider) {
    case 'mock': {
      const { MockStorageAdapter } = await import('@/lib/services/storage/MockStorageAdapter');
      _storageService = new MockStorageAdapter();
      break;
    }
    default:
      throw new Error(`Unknown storage provider: ${env.storageProvider}`);
  }

  return _storageService;
}
