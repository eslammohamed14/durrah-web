import "server-only";

import { cookies } from "next/headers";

import { API_CONFIG } from "@/api/config";

type ServerFetchOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown> | null;
  searchParams?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
};

export class ServerFetchError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
    public readonly url: string
  ) {
    super(`serverFetch ${status} ${statusText} (${url})`);
    this.name = "ServerFetchError";
  }
}

const stripTrailingSlash = (value: string): string =>
  value.endsWith("/") ? value.slice(0, -1) : value;

const buildUrl = (
  path: string,
  searchParams?: ServerFetchOptions["searchParams"]
): string => {
  const base = /^https?:\/\//.test(path)
    ? path
    : `${stripTrailingSlash(API_CONFIG.baseURL)}${path.startsWith("/") ? path : `/${path}`}`;

  if (!searchParams) return base;

  const query = Object.entries(searchParams)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  if (!query) return base;
  return `${base}${base.includes("?") ? "&" : "?"}${query}`;
};

export const serverFetch = async <TResponse>(
  path: string,
  {
    searchParams,
    auth = false,
    body,
    headers,
    ...init
  }: ServerFetchOptions = {}
): Promise<TResponse> => {
  const url = buildUrl(path, searchParams);

  const mergedHeaders = new Headers({
    ...API_CONFIG.headers,
    ...(headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : (headers as Record<string, string> | undefined)),
  });

  if (auth) {
    const accessToken = (await cookies()).get("access_token")?.value;
    if (accessToken) {
      mergedHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: mergedHeaders,
    body:
      body && typeof body === "object" && !(body instanceof FormData)
        ? JSON.stringify(body)
        : (body as BodyInit | null | undefined),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new ServerFetchError(
      response.status,
      response.statusText,
      errorBody,
      url
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
};
