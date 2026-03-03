import { FileText } from "lucide-react";

type DocumentIconProps = {
  className?: string;
};

export default function DocumentIcon({ className = "h-10 w-10 text-primary-300" }: DocumentIconProps) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100">
      <FileText className={className} aria-hidden="true" />
    </div>
  );
}
