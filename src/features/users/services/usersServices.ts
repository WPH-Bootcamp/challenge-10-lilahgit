import { request } from "@/shared/lib/api/apiClient";
import type {
  PublicProfileWithPosts,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateProfileResponse,
  UserById,
  UserMe,
} from "@/features/users/types/type";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "@/features/users/validators/userValidator";

function buildFormData(fields: Record<string, unknown>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
}

export function getMe() {
  return request<UserMe>("GET", "/users/me", { withAuth: true });
}

export function getUserByUsername(username: string, page = 1, limit = 10) {
  return request<PublicProfileWithPosts>(
    "GET",
    `/users/by-username/${encodeURIComponent(username)}`,
    {
      params: { page, limit },
      withAuth: false,
    },
  );
}

export function getUserById(id: number | string) {
  return request<UserById>("GET", `/users/${id}`, { withAuth: false });
}

export function updateProfile(payload: {
  name?: string;
  headline?: string;
  avatar?: File;
}) {
  const validated = updateProfileSchema.parse(payload);
  const formData = buildFormData(validated);
  return request<UpdateProfileResponse>("PATCH", "/users/profile", {
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    withAuth: true,
  });
}

export function updatePassword(payload: UpdatePasswordRequest) {
  const validated = updatePasswordSchema.parse(payload);
  return request<UpdatePasswordResponse>("PATCH", "/users/password", {
    data: validated,
    withAuth: true,
  });
}
