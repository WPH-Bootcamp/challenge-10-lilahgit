"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PenLine } from "lucide-react";
import { useMe } from "@/features/users/hooks/useUsers";

type AuthHeaderActionsProps = {
  name?: string;
  initials?: string;
  avatarUrl?: string | null;
  showName?: boolean;
  menu?: ReactNode;
  menuHref?: string;
  onMenuToggle?: () => void;
};

export function AuthHeaderActions({
  name = "John Doe",
  initials = "JD",
  avatarUrl,
  showName = true,
  menu,
  menuHref,
  onMenuToggle,
}: AuthHeaderActionsProps) {
  const { data: me } = useMe();
  const resolvedName = me?.name || name;
  const resolvedInitials =
    me?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || initials;
  const resolvedAvatarUrl = me?.avatarUrl || avatarUrl;

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
              {resolvedAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolvedAvatarUrl} alt={resolvedName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center">{resolvedInitials}</span>
              )}
            </span>
            {showName ? <span className="hidden md:block">{resolvedName}</span> : null}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-800"
          >
            <span className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
              {resolvedAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolvedAvatarUrl} alt={resolvedName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center">{resolvedInitials}</span>
              )}
            </span>
            {showName ? <span className="hidden md:block">{resolvedName}</span> : null}
          </button>
        )}
        {menu}
      </div>
    </div>
  );
}

export function MobileAvatarAction({ initials = "JD", avatarUrl }: { initials?: string; avatarUrl?: string | null }) {
  const { data: me } = useMe();
  const resolvedInitials =
    me?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || initials;
  const resolvedAvatarUrl = me?.avatarUrl || avatarUrl;
  const resolvedName = me?.name || "Profile";

  return (
    <div className="h-9 w-9 overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
      {resolvedAvatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolvedAvatarUrl} alt={resolvedName} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">{resolvedInitials}</span>
      )}
    </div>
  );
}
