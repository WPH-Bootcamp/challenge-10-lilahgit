import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  action?: ReactNode;
  className?: string;
};

export default function SectionHeading({ title, action, className = "" }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className={`display-sm font-bold ${className}`}>{title}</h2>
      {action}
    </div>
  );
}

