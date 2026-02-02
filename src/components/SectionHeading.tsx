import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  action?: ReactNode;
};

export default function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">{title}</h2>
      {action}
    </div>
  );
}

