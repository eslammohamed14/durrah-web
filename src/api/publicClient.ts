import "client-only";

import axios from "axios";

import { API_CONFIG } from "@/api/config";

export const publicClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { ...API_CONFIG.headers },
});
