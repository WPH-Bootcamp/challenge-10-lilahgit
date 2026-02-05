import { z } from "zod";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_AVATAR_SIZE, "Avatar must be smaller than 5MB.")
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Avatar must be PNG or JPG.")
    .optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password must match new password.",
    path: ["confirmPassword"],
  });
