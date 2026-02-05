import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const commentSchema = z.object({
  id: z.number(),
  content: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().optional(),
    headline: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
  }),
  post: z.object({ id: z.number() }).optional(),
  createdAt: z.string(),
});

export const commentsListSchema = z.array(commentSchema);
