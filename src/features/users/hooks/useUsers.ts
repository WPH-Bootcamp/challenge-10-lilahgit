"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/shared/lib/auth/token";
import {
  getMe,
  getUserById,
  getUserByUsername,
  updatePassword,
  updateProfile,
} from "@/features/users/services/usersServices";
import type {
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateProfileResponse,
  UserMe,
} from "@/features/users/types/type";

export function useMe() {
  const hasToken = Boolean(getToken());
  return useQuery<UserMe>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: hasToken,
  });
}

export function useUserByUsername(username: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["user", "by-username", username, page, limit],
    queryFn: () => getUserByUsername(username, page, limit),
    enabled: Boolean(username),
  });
}

export function useUserById(id: number | string) {
  return useQuery({
    queryKey: ["user", "by-id", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateProfileResponse,
    Error,
    { name?: string; headline?: string; avatar?: File }
  >({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation<UpdatePasswordResponse, Error, UpdatePasswordRequest>({
    mutationFn: updatePassword,
  });
}
