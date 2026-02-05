"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/services/authServices";
import { loginSchema } from "@/features/auth/validators/authValidator";
import { setToken } from "@/shared/lib/auth/token";
import type { ApiError } from "@/shared/lib/api/apiClient";
import { Eye, EyeOff } from "lucide-react";

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = Boolean(error);

  const handleChange = (field: keyof LoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const payload = { email: form.email.trim(), password: form.password };
    const validation = loginSchema.safeParse(payload);
    if (!validation.success) {
      const nextFieldErrors: Partial<Record<keyof LoginFormState, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormState | undefined;
        if (field && !nextFieldErrors[field]) nextFieldErrors[field] = issue.message;
      });
      setFieldErrors(nextFieldErrors);
      setError(validation.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(payload);
      setToken(result.token);
      router.push("/?auth=1");
      router.refresh();
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError?.message ?? "Login failed. Please try again.";
      if (message.toLowerCase().includes("invalid credentials")) {
        setFieldErrors({
          email: "Email or password is incorrect.",
          password: "Email or password is incorrect.",
        });
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-25 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Sign In</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-neutral-800">
            Email
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="Enter your email"
              className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${fieldErrors.email ? "border-red-400" : "border-neutral-200"}`}
            />
            {fieldErrors.email && <span className="mt-2 block text-xs text-red-500">{fieldErrors.email}</span>}
          </label>

          <label className="block text-sm font-semibold text-neutral-800">
            Password
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                className={`w-full rounded-lg border bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${fieldErrors.password ? "border-red-400" : "border-neutral-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {fieldErrors.password && <span className="mt-2 block text-xs text-red-500">{fieldErrors.password}</span>}
          </label>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-300 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
