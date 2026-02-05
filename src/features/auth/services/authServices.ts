import { request } from "@/shared/lib/api/apiClient";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/features/auth/types/type";
import {
  loginSchema,
  normalizeRegisterInput,
  registerSchema,
} from "@/features/auth/validators/authValidator";

export async function register(
  payload: Omit<RegisterRequest, "username"> & { username?: string },
) {
  const validated = registerSchema.parse({
    ...payload,
    email: payload.email.trim().toLowerCase(),
  });
  const normalized = normalizeRegisterInput(validated);
  return request<RegisterResponse>("POST", "/auth/register", {
    data: normalized,
    withAuth: false,
  });
}

export async function login(payload: LoginRequest) {
  const validated = loginSchema.parse({
    ...payload,
    email: payload.email.trim().toLowerCase(),
  });
  return request<LoginResponse>("POST", "/auth/login", {
    data: validated,
    withAuth: false,
  });
}
