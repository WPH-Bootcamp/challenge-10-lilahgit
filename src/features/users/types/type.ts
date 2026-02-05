import type { Pagination, Post } from "@/features/posts/types/type";

export type UserMe = {
  id: number;
  name: string;
  email: string;
  headline: string | null;
  avatarUrl: string | null;
};

export type UserById = {
  id: number;
  name: string;
  email: string;
  username: string;
  headline: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
};

export type PublicProfileWithPosts = {
  id: number;
  name: string;
  username: string;
  headline: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  posts: Pagination<Post>;
};

export type UpdateProfileResponse = {
  id: number;
  name: string;
  headline: string | null;
  avatarUrl: string | null;
  email: string;
};

export type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdatePasswordResponse = {
  success: true;
  message: string;
};
