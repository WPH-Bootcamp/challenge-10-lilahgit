"use client";

import Link from "next/link";
import { useState } from "react";
import { register } from "@/features/auth/services/authServices";
import { registerSchema } from "@/features/auth/validators/authValidator";
import type { ApiError } from "@/shared/lib/api/apiClient";
import { Eye, EyeOff } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Confirm password must match password." });
      setError("Confirm password must match password.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    };
    const validation = registerSchema.safeParse(payload);
    if (!validation.success) {
      const nextFieldErrors: Partial<Record<keyof FormState, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormState | undefined;
        if (field && !nextFieldErrors[field]) nextFieldErrors[field] = issue.message;
      });
      setFieldErrors(nextFieldErrors);
      setError(validation.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(payload);
      setSuccess("Registration successful. Please log in.");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError?.message ?? "Registration failed. Please try again.";
      if (message.toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({ ...prev, email: message }));
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-25 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Sign Up</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-neutral-800">
            Name
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Enter your name"
              className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${fieldErrors.name ? "border-red-400" : "border-neutral-200"}`}
            />
            {fieldErrors.name && <span className="mt-2 block text-xs text-red-500">{fieldErrors.name}</span>}
          </label>

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

          <label className="block text-sm font-semibold text-neutral-800">
            Confirm Password
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="Enter your confirm password"
                className={`w-full rounded-lg border bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${fieldErrors.confirmPassword ? "border-red-400" : "border-neutral-200"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && <span className="mt-2 block text-xs text-red-500">{fieldErrors.confirmPassword}</span>}
          </label>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          {success && <p className="text-sm font-medium text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-300 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

