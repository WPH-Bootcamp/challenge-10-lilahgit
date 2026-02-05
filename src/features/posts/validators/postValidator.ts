import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string().nullable(),
  imagePublicId: z.string().nullable(),
  createdAt: z.string(),
  likes: z.number(),
  comments: z.number(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    username: z.string().optional(),
    headline: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
  }),
});

export const paginationSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    lastPage: z.number(),
  });

export function validatePostImage(image?: File | null) {
  if (!image) return true;
  if (image.size > MAX_IMAGE_SIZE) return false;
  return ACCEPTED_IMAGE_TYPES.includes(image.type);
}
