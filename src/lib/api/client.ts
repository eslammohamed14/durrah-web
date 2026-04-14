/**
 * Base API client with fetch wrapper, interceptors, error handling, and retry logic.
 */

import { env } from '@/config/env';

// ─── Error Types ──────────────────────────────────────────────────────────────

export class APIError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface APIConfig {
  baseURL: string;
  timeout?: number;
  maxRetries?: number;
}

interface RequestConfig {
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export class BaseAPIClient {
  protected baseURL: string;
  protected authToken?: string;
  private timeout: number;
  private maxRetries: number;

  constructor(config: APIConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, '');
    this.timeout = config.timeout ?? 10_000;
    this.maxRetries = config.maxRetries ?? 1;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  // ─── Interceptors ───────────────────────────────────────────────────────────

  protected buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      // 204 No Content
      if (response.status === 204) return undefined as T;
      const json = await response.json();
      // Unwrap { data: T } envelope if present
      return ('data' in json ? json.data : json) as T;
    }

    let errorBody: { error?: { code?: string; message?: string; details?: unknown } } = {};
    try {
      errorBody = await response.json();
    } catch {
      // ignore parse errors
    }

    const code = errorBody.error?.code ?? 'UNKNOWN_ERROR';
    const message = errorBody.error?.message ?? response.statusText ?? 'An unexpected error occurred';
    const details = errorBody.error?.details;

    throw new APIError(response.status, message, code, details);
  }

  // ─── Core Fetch ─────────────────────────────────────────────────────────────

  protected async request<T>(
    path: string,
    config: RequestConfig,
    attempt = 0
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${path}`, {
        ...config,
        signal: config.signal ?? controller.signal,
      });
      return await this.handleResponse<T>(response);
    } catch (err) {
      if (err instanceof APIError) {
        // Retry on 5xx or network errors, but not on 4xx
        const shouldRetry = err.statusCode >= 500 && attempt < this.maxRetries;
        if (shouldRetry) {
          await delay(200 * (attempt + 1));
          return this.request<T>(path, config, attempt + 1);
        }
        throw err;
      }

      // Network / timeout errors
      if (attempt < this.maxRetries) {
        await delay(200 * (attempt + 1));
        return this.request<T>(path, config, attempt + 1);
      }

      throw new APIError(0, 'Network error. Please check your connection.', 'NETWORK_ERROR', err);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ─── HTTP Helpers ────────────────────────────────────────────────────────────

  protected get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET', headers: this.buildHeaders() });
  }

  protected post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      headers: this.buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', headers: this.buildHeaders() });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  const qs = entries
    .map(([k, v]) => {
      if (Array.isArray(v)) return v.map((item) => `${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`).join('&');
      return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
    })
    .join('&');
  return `?${qs}`;
}
