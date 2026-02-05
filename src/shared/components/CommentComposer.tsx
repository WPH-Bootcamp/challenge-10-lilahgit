"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createComment } from "@/features/comments/services/commentsServices";
import { createCommentSchema } from "@/features/comments/validators/commentValidator";
import type { ApiError } from "@/shared/lib/api/apiClient";

type CommentComposerProps = {
  postId: number | string;
};

export default function CommentComposer({ postId }: CommentComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const validation = createCommentSchema.safeParse({ content });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Invalid comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment(postId, { content: validation.data.content });
      setContent("");
      setSuccessMessage("Comment sent successfully.");
      router.refresh();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to send comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <label className="text-xs font-semibold text-neutral-600">Give your Comment</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Enter your comment"
          className={`flex-1 rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 ${
            error ? "border-red-400" : "border-neutral-200"
          }`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary-300 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
      {successMessage ? (
        <span className="text-xs text-green-600">{successMessage}</span>
      ) : null}
    </form>
  );
}
