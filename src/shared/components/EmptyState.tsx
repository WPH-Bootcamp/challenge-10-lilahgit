import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: "card" | "centered";
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  variant = "card",
}: EmptyStateProps) {
  const wrapperClass =
    variant === "centered"
      ? "flex flex-col items-center justify-center text-center"
      : "rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center";

  return (
    <div className={wrapperClass}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-neutral-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

