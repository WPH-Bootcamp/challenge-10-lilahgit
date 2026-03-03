"use client";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-primary-300 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}

