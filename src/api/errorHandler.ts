import "client-only";

import axios, { type AxiosError } from "axios";

export type ApiError = {
  statusCode: number;
  message: string;
  details?: unknown;
};

export const mapAxiosError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      details?: unknown;
    }>;

    return {
      statusCode: axiosError.response?.status ?? 500,
      message:
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Unexpected API error",
      details: axiosError.response?.data?.details,
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    message: "Unknown error occurred",
  };
};

export const throwApiError = (error: unknown): never => {
  throw mapAxiosError(error);
};
