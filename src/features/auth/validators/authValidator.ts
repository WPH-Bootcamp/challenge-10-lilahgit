import { z } from "zod";

function deriveUsername(email: string) {
  const base = email.split("@")[0] || "";
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (cleaned.length > 0) return cleaned;
  const fallback = Math.random().toString(36).slice(2, 8);
  return `user_${fallback}`;
}

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required.").max(255, "Name must be at most 255 characters."),
  username: z.string().optional(),
  email: z.string().email("Email is invalid."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.string().email("Email is invalid."),
  password: z.string().min(1, "Password is required."),
});

export function normalizeRegisterInput(input: z.input<typeof registerSchema>) {
  const username = input.username?.trim() || deriveUsername(input.email);
  return { ...input, username };
}
