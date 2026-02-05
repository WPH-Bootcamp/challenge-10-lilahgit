"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "@/features/comments/services/commentsServices";
import type { ApiError } from "@/shared/lib/api/apiClient";
import type { Comment } from "@/features/comments/types/type";
import type { DeleteResponse } from "@/features/posts/types/type";

export function useCreateComment(postId: number | string) {
  const queryClient = useQueryClient();
  return useMutation<Comment, ApiError, string, { previousComments: Comment[] }>({
    mutationFn: (content) => createComment(postId, { content }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId, "comments"] });
      const previousComments =
        queryClient.getQueryData<Comment[]>(["post", postId, "comments"]) ?? [];

      const optimisticComment: Comment = {
        id: -Date.now(),
        content,
        createdAt: new Date().toISOString(),
        post: { id: Number(postId) },
        author: {
          id: 0,
          name: "You",
          email: "",
        },
      };

      queryClient.setQueryData<Comment[]>(
        ["post", postId, "comments"],
        [optimisticComment, ...previousComments],
      );

      return { previousComments };
    },
    onError: (_error, _content, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["post", postId, "comments"],
          context.previousComments,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeleteComment(postId: number | string) {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ApiError, number | string>({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
