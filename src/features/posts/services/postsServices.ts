import { request } from "@/shared/lib/api/apiClient";
import type { Comment } from "@/features/comments/types/type";
import type {
  DeleteResponse,
  LikeUser,
  Pagination,
  Post,
  PostsByUserIdResponse,
  PostsByUsernameResponse,
} from "@/features/posts/types/type";
import { commentsListSchema } from "@/features/comments/validators/commentValidator";
import {
  paginationSchema,
  postSchema,
} from "@/features/posts/validators/postValidator";

function buildFormData(fields: Record<string, unknown>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
      return;
    }
    if (typeof value === "boolean") {
      if (key === "removeImage") {
        if (value) formData.append(key, "true");
        return;
      }
      formData.append(key, value ? "true" : "false");
      return;
    }
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
}

export function getRecommended(page = 1, limit = 10) {
  return request<Pagination<Post>>("GET", "/posts/recommended", {
    params: { page, limit },
    schema: paginationSchema(postSchema),
    withAuth: false,
  });
}

export function getMostLiked(page = 1, limit = 10) {
  return request<Pagination<Post>>("GET", "/posts/most-liked", {
    params: { page, limit },
    schema: paginationSchema(postSchema),
    withAuth: false,
  });
}

export function getMyPosts(page = 1, limit = 10) {
  return request<Pagination<Post>>("GET", "/posts/my-posts", {
    params: { page, limit },
    schema: paginationSchema(postSchema),
    withAuth: true,
  });
}

export function searchPosts(query: string, page = 1, limit = 10) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    throw new Error("Query is required.");
  }

  return request<Pagination<Post>>("GET", "/posts/search", {
    params: { query: normalizedQuery, page, limit },
    schema: paginationSchema(postSchema),
    withAuth: false,
  });
}

export function getPost(id: number | string) {
  return request<Post>("GET", `/posts/${id}`, {
    schema: postSchema,
    withAuth: false,
  });
}

export function createPost(payload: {
  title: string;
  content: string;
  tags: string[];
  image: File;
}) {
  const formData = buildFormData(payload);
  return request<Post>("POST", "/posts", {
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    withAuth: true,
  });
}

export function updatePost(
  id: number | string,
  payload: {
    title?: string;
    content?: string;
    tags?: string[];
    image?: File;
    removeImage?: boolean;
  },
) {
  const formData = buildFormData(payload);
  return request<Post>("PATCH", `/posts/${id}`, {
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    withAuth: true,
  });
}

export function deletePost(id: number | string) {
  return request<DeleteResponse>("DELETE", `/posts/${id}`, { withAuth: true });
}

export function likePost(id: number | string) {
  return request<Post>("POST", `/posts/${id}/like`, { withAuth: true });
}

export function getPostLikes(id: number | string) {
  return request<LikeUser[]>("GET", `/posts/${id}/likes`, { withAuth: false });
}

export function getPostComments(id: number | string) {
  return request<Comment[]>("GET", `/posts/${id}/comments`, {
    schema: commentsListSchema,
    withAuth: false,
  });
}

export function getPostsByUsername(username: string, page = 1, limit = 10) {
  return request<PostsByUsernameResponse>(
    "GET",
    `/posts/by-username/${encodeURIComponent(username)}`,
    {
      params: { page, limit },
      withAuth: false,
    },
  );
}

export function getPostsByUserId(
  userId: number | string,
  page = 1,
  limit = 10,
) {
  return request<PostsByUserIdResponse>("GET", `/posts/by-user/${userId}`, {
    params: { page, limit },
    withAuth: false,
  });
}
