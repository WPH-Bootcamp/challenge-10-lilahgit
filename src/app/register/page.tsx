"use client";

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import { Eye } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasError = Boolean(error);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess("Registration successful. Please log in.");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
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
              className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${hasError ? "border-red-400" : "border-neutral-200"}`}
            />
            {hasError && <span className="mt-2 block text-xs text-red-500">Error Text Helper</span>}
          </label>

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

          <label className="block text-sm font-semibold text-neutral-800">
            Confirm Password
            <div className="relative mt-2">
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="Enter your confirm password"
                className={`w-full rounded-lg border bg-white px-4 py-3 pr-10 text-sm text-neutral-900 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${hasError ? "border-red-400" : "border-neutral-200"}`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <Eye className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            {hasError && <span className="mt-2 block text-xs text-red-500">Error Text Helper</span>}
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

