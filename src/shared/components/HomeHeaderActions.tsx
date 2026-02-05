"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Search, User, X } from "lucide-react";
import {
  AuthHeaderActions,
  MobileAvatarAction,
} from "@/components/AuthHeaderActions";
import Logo from "@/components/Logo";
import RegisterButton from "@/components/RegisterButton";
import { useMe } from "@/features/users/hooks/useUsers";
import { clearToken, getToken } from "@/shared/lib/auth/token";

function initialsFromName(name?: string) {
  if (!name) return "JD";
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "JD";
}

export function HomeDesktopActions() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { data: me } = useMe();

  useEffect(() => {
    setHasToken(Boolean(getToken()));
  }, []);

  const handleLogout = () => {
    clearToken();
    setHasToken(false);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!hasToken) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-primary-300">
          Login
        </Link>
        <span className="h-5 w-px bg-neutral-300" />
        <RegisterButton />
      </div>
    );
  }

  return (
    <AuthHeaderActions
      name={me?.name || "John Doe"}
      initials={initialsFromName(me?.name)}
      avatarUrl={me?.avatarUrl}
      onMenuToggle={() => setIsMenuOpen((prev) => !prev)}
      menu={
        isMenuOpen ? (
          <div className="profile-menu-panel absolute right-0 top-full mt-3 border border-neutral-200 bg-white p-2 shadow-sm">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              type="button"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        ) : null
      }
    />
  );
}

export function HomeMobileActions({ hideSearch = false }: { hideSearch?: boolean }) {
  const router = useRouter();
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { data: me } = useMe();

  useEffect(() => {
    setHasToken(Boolean(getToken()));
  }, []);

  const handleLogout = () => {
    clearToken();
    setHasToken(false);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!hasToken) {
    return (
      <div className="flex items-center gap-2">
        {!hideSearch ? (
          <Link href="/search" className="rounded-full p-2 text-neutral-600">
            <Search className="h-6 w-6" aria-hidden="true" />
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => setIsGuestMenuOpen(true)}
          className="rounded-full p-2 text-neutral-700"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        {isGuestMenuOpen ? (
          <div className="fixed inset-0 z-50">
            <div className="header-height-mobile flex items-center justify-between border-b border-neutral-200 px-4">
              <Logo className="header-logo-mobile" />
              <button
                type="button"
                onClick={() => setIsGuestMenuOpen(false)}
                aria-label="Close menu"
                className="p-0 text-neutral-900"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mx-auto mt-8 flex w-[182px] flex-col items-center gap-4">
              <Link
                href="/login"
                className="text-lg font-semibold text-primary-300"
              >
                Login
              </Link>
              <RegisterButton className="w-full py-3 text-lg" />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {!hideSearch ? (
          <Link href="/search" className="rounded-full p-2 text-neutral-600">
            <Search className="h-6 w-6" aria-hidden="true" />
          </Link>
        ) : null}
        <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)}>
          <MobileAvatarAction
            initials={initialsFromName(me?.name)}
            avatarUrl={me?.avatarUrl}
          />
        </button>
      </div>
      {isMenuOpen ? (
        <div className="profile-menu-panel absolute right-0 top-full mt-3 border border-neutral-200 bg-white p-2 shadow-sm">
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            type="button"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
