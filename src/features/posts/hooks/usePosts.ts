"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "@/features/comments/types/type";
import {
  createPost,
  deletePost,
  getMostLiked,
  getMyPosts,
  getPost,
  getPostComments,
  getPostLikes,
  getPostsByUserId,
  getPostsByUsername,
  getRecommended,
  likePost,
  searchPosts,
  updatePost,
} from "@/features/posts/services/postsServices";
import type {
  LikeUser,
  Pagination,
  Post,
  PostsByUserIdResponse,
  PostsByUsernameResponse,
} from "@/features/posts/types/type";

export function useRecommendedPosts({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) {
  return useQuery<Pagination<Post>>({
    queryKey: ["posts", "recommended", page, limit],
    queryFn: () => getRecommended(page, limit),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useMostLikedPosts({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) {
  return useQuery<Pagination<Post>>({
    queryKey: ["posts", "most-liked", page, limit],
    queryFn: () => getMostLiked(page, limit),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useSearchPosts({
  query,
  limit = 10,
  page = 1,
}: {
  query: string;
  limit?: number;
  page?: number;
}) {
  return useQuery<Pagination<Post>>({
    queryKey: ["posts", "search", query, page, limit],
    queryFn: () => searchPosts(query, page, limit),
    enabled: query.trim().length > 0,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function usePostDetail(id: number | string) {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: Boolean(id),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function usePostComments(
  id: number | string,
  options?: { initialData?: Comment[] },
) {
  return useQuery<Comment[]>({
    queryKey: ["post", id, "comments"],
    queryFn: () => getPostComments(id),
    enabled: Boolean(id),
    initialData: options?.initialData,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function usePostLikes(id: number | string) {
  return useQuery<LikeUser[]>({
    queryKey: ["post", id, "likes"],
    queryFn: () => getPostLikes(id),
    enabled: Boolean(id),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useMyPosts({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) {
  return useQuery<Pagination<Post>>({
    queryKey: ["posts", "my-posts", page, limit],
    queryFn: () => getMyPosts(page, limit),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function usePostsByUsername(
  username: string,
  { limit = 10, page = 1 }: { limit?: number; page?: number },
) {
  return useQuery<PostsByUsernameResponse>({
    queryKey: ["posts", "by-username", username, page, limit],
    queryFn: () => getPostsByUsername(username, page, limit),
    enabled: Boolean(username),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function usePostsByUserId(
  userId: number | string,
  { limit = 10, page = 1 }: { limit?: number; page?: number },
) {
  return useQuery<PostsByUserIdResponse>({
    queryKey: ["posts", "by-user", userId, page, limit],
    queryFn: () => getPostsByUserId(userId, page, limit),
    enabled: Boolean(userId),
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<
    Post,
    Error,
    { title: string; content: string; tags: string[]; image: File }
  >({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation<
    Post,
    Error,
    {
      id: number | string;
      payload: {
        title?: string;
        content?: string;
        tags?: string[];
        image?: File;
        removeImage?: boolean;
      };
    }
  >({
    mutationFn: ({ id, payload }) => updatePost(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation<Post, Error, number | string, { previous?: Post }>({
    mutationFn: likePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["post", id] });
      const previous = queryClient.getQueryData<Post>(["post", id]);
      if (previous) {
        queryClient.setQueryData<Post>(["post", id], {
          ...previous,
          likes: previous.likes + 1,
        });
      }
      return { previous };
    },
    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["post", id], context.previous);
      }
      throw error;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["post", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
const POLL_INTERVAL_MS = 10_000;
