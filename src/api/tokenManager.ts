import "client-only";

import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const ACCESS_TOKEN_TTL_DAYS = 1;
const REFRESH_TOKEN_TTL_DAYS = 30;

const baseCookieOptions: Cookies.CookieAttributes = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const tokenManager = {
  getAccessToken: (): string | undefined => Cookies.get(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | undefined => Cookies.get(REFRESH_TOKEN_KEY),

  setAccessToken: (token: string): void => {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      ...baseCookieOptions,
      expires: ACCESS_TOKEN_TTL_DAYS,
    });
  },

  setRefreshToken: (token: string): void => {
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      ...baseCookieOptions,
      expires: REFRESH_TOKEN_TTL_DAYS,
    });
  },

  clearTokens: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
  },
};
