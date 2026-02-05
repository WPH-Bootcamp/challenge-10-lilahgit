"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register } from "@/features/auth/services/authServices";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/features/auth/types/type";
import { setToken } from "@/shared/lib/auth/token";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<
    RegisterResponse,
    Error,
    Omit<RegisterRequest, "username"> & { username?: string }
  >({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
