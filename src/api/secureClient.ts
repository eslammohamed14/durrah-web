import "client-only";

import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_CONFIG } from "@/api/config";
import { publicClient } from "@/api/publicClient";
import { tokenManager } from "@/api/tokenManager";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

export class AuthExpiredError extends Error {
  constructor() {
    super("Authentication expired. Please sign in again.");
    this.name = "AuthExpiredError";
  }
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null): void => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await publicClient.post<RefreshResponse>(
      "/auth/refresh",
      { refreshToken }
    );

    tokenManager.setAccessToken(data.accessToken);
    if (data.refreshToken) {
      tokenManager.setRefreshToken(data.refreshToken);
    }

    return data.accessToken;
  } catch {
    tokenManager.clearTokens();
    return null;
  }
};

export const secureClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { ...API_CONFIG.headers },
});

secureClient.interceptors.request.use((config) => {
  const accessToken = tokenManager.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

secureClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const statusCode = error.response?.status;

    if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken) => {
          if (!newToken) {
            reject(new AuthExpiredError());
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(secureClient(originalRequest as AxiosRequestConfig));
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      flushQueue(newToken);

      if (!newToken) {
        return Promise.reject(new AuthExpiredError());
      }

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return secureClient(originalRequest as AxiosRequestConfig);
    } finally {
      isRefreshing = false;
    }
  }
);
