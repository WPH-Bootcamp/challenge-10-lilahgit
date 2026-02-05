import axios, { type AxiosError, type AxiosRequestConfig, type Method } from "axios";
import { z } from "zod";
import { getToken } from "@/shared/lib/auth/token";

const API_BASE_URL = "https://be-blg-production.up.railway.app/";

export type ApiError = {
  statusCode: number;
  message: string;
  errors?: string[];
  path?: string;
  raw?: unknown;
};

type ApiErrorPayload = {
  statusCode?: number;
  message?: string;
  path?: string;
  details?: {
    errors?: string[];
  };
};

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const data = axiosError.response?.data;
    const statusCode = axiosError.response?.status ?? data?.statusCode ?? 500;
    const errors = data?.details?.errors;
    const message = errors?.[0] || data?.message || "Request failed";
    return {
      statusCode,
      message,
      errors,
      path: data?.path,
      raw: data ?? axiosError.toJSON(),
    };
  }

  if (error instanceof Error) {
    return { statusCode: 500, message: error.message, raw: error };
  }

  return { statusCode: 500, message: "Request failed", raw: error };
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RequestOptions<T> = {
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  schema?: z.ZodType<T>;
  withAuth?: boolean;
};

export async function request<T>(method: Method, url: string, options: RequestOptions<T> = {}) {
  const token = getToken();
  const useAuth = options.withAuth ?? true;
  const config: AxiosRequestConfig = {
    method,
    url,
    data: options.data,
    params: options.params,
    headers: {
      ...(options.headers ?? {}),
      ...(useAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  try {
    const response = await client.request<T>(config);
    if (options.schema) {
      const parsed = options.schema.safeParse(response.data);
      if (!parsed.success) {
        throw {
          statusCode: 500,
          message: "Invalid response shape",
          raw: parsed.error,
        } satisfies ApiError;
      }
      return parsed.data;
    }
    return response.data;
  } catch (error) {
    if ((error as ApiError)?.statusCode) {
      throw error as ApiError;
    }
    throw normalizeApiError(error);
  }
}
