import { request } from "@/shared/lib/api/apiClient";
import type { Comment } from "@/features/comments/types/type";
import type { DeleteResponse } from "@/features/posts/types/type";
import {
  commentSchema,
  commentsListSchema,
  createCommentSchema,
} from "@/features/comments/validators/commentValidator";

export function getComments(postId: number | string) {
  return request<Comment[]>("GET", `/posts/${postId}/comments`, {
    schema: commentsListSchema,
    withAuth: false,
  });
}

export function createComment(
  postId: number | string,
  payload: { content: string },
) {
  const validated = createCommentSchema.parse(payload);
  return request<Comment>("POST", `/comments/${postId}`, {
    data: validated,
    schema: commentSchema,
    withAuth: true,
  });
}

export function deleteComment(commentId: number | string) {
  return request<DeleteResponse>("DELETE", `/comments/${commentId}`, {
    withAuth: true,
  });
}
