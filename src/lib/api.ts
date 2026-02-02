import type { BlogPost, Comment, PaginatedResponse, PostsByUsernameResponse } from "@/types/blog";

const DEFAULT_API_BASE_URL = "https://be-blg-production.up.railway.app/api";
const DEFAULT_AUTH_BASE_URL = "https://be-blg-production.up.railway.app";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL;
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? DEFAULT_AUTH_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchAPI<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

async function fetchAuth<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = `API Error: ${response.status} ${response.statusText}`;
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export function getRecommendedPosts(page = 1, limit = 9) {
  return fetchAPI<PaginatedResponse<BlogPost>>(
    `/posts/recommended?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

export function getMostLikedPosts(page = 1, limit = 5) {
  return fetchAPI<PaginatedResponse<BlogPost>>(
    `/posts/most-liked?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

export function searchPosts(query: string, page = 1, limit = 9) {
  return fetchAPI<PaginatedResponse<BlogPost>>(
    `/posts/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    { next: { revalidate: 30 } }
  );
}

export function getPostById(id: string | number) {
  return fetchAPI<BlogPost>(`/posts/${id}`, { next: { revalidate: 120 } });
}

export function getPostComments(id: string | number) {
  return fetchAPI<Comment[]>(`/posts/${id}/comments`, {
    next: { revalidate: 120 },
  });
}

export function getPostsByUsername(username: string, page = 1, limit = 6) {
  return fetchAPI<PostsByUsernameResponse>(
    `/posts/by-username/${encodeURIComponent(username)}?page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
}

type RegisterPayload = {
  name: string;
  username?: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  id: number;
  email: string;
  username: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export function registerUser(payload: RegisterPayload) {
  return fetchAuth<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return fetchAuth<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL, AUTH_BASE_URL, fetchAPI };
