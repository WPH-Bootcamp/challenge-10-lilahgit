import Link from "next/link";
import type { ReactNode } from "react";
import { PenLine } from "lucide-react";

type AuthHeaderActionsProps = {
  name?: string;
  initials?: string;
  showName?: boolean;
  menu?: ReactNode;
  menuHref?: string;
};

export function AuthHeaderActions({
  name = "John Doe",
  initials = "JD",
  showName = true,
  menu,
  menuHref,
}: AuthHeaderActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href="/create" className="flex items-center gap-2 text-sm font-semibold text-primary-300">
        <PenLine className="h-4 w-4" aria-hidden="true" />
        Write Post
      </Link>
      <div className="relative">
        {menuHref ? (
          <Link href={menuHref} className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
            <span className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
              <span className="flex h-full w-full items-center justify-center">{initials}</span>
            </span>
            {showName ? <span className="hidden md:block">{name}</span> : null}
          </Link>
        ) : (
          <button type="button" className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
            <span className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
              <span className="flex h-full w-full items-center justify-center">{initials}</span>
            </span>
            {showName ? <span className="hidden md:block">{name}</span> : null}
          </button>
        )}
        {menu}
      </div>
    </div>
  );
}

export function MobileAvatarAction({ initials = "JD" }: { initials?: string }) {
  return (
    <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
      <span className="flex h-full w-full items-center justify-center">{initials}</span>
    </div>
  );
}
