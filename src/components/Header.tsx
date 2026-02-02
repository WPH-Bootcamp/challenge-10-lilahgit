import Link from "next/link";
import type { ReactNode } from "react";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";

type HeaderProps = {
  showSearch?: boolean;
  showMobileSearch?: boolean;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  rightSlot?: ReactNode;
  mobileActions?: ReactNode;
};

export default function Header({
  showSearch = true,
  showMobileSearch = false,
  searchPlaceholder = "Search",
  searchDefaultValue = "",
  rightSlot,
  mobileActions,
}: HeaderProps) {
  const desktopActions = rightSlot ?? (
    <>
      <Link href="/login" className="text-sm font-medium text-primary-300">
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-primary-300 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-400"
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container className="flex header-height items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <Logo className="h-6 w-auto" />
        </Link>

        {showSearch ? (
          <div className="hidden w-full max-w-search sm:block">
            <SearchBar defaultValue={searchDefaultValue} placeholder={searchPlaceholder} />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="hidden items-center gap-3 sm:flex">{desktopActions}</div>
        <div className="flex items-center gap-3 sm:hidden">
          {mobileActions ?? desktopActions}
        </div>
      </Container>
      {showSearch && showMobileSearch && (
        <div className="border-t border-neutral-200 sm:hidden">
          <Container className="py-3">
            <SearchBar defaultValue={searchDefaultValue} placeholder={searchPlaceholder} />
          </Container>
        </div>
      )}
    </header>
  );
}

