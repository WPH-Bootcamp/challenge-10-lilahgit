"use client";

import Link from "next/link";
import { useState } from "react";
import { loginUser } from "@/lib/api";
import { Eye } from "lucide-react";

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasError = Boolean(error);

  const handleChange = (field: keyof LoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await loginUser({ email: form.email, password: form.password });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
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
              className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${hasError ? "border-red-400" : "border-neutral-200"}`}
            />
            {hasError && <span className="mt-2 block text-xs text-red-500">Error Text Helper</span>}
          </label>

          <label className="block text-sm font-semibold text-neutral-800">
            Password
            <div className="relative mt-2">
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                className={`w-full rounded-lg border bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${hasError ? "border-red-400" : "border-neutral-200"}`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Eye className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            {hasError && <span className="mt-2 block text-xs text-red-500">Error Text Helper</span>}
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
