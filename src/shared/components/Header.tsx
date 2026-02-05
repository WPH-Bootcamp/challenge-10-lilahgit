import Link from "next/link";
import type { ReactNode } from "react";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import RegisterButton from "@/components/RegisterButton";

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
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-sm font-semibold text-primary-300">
        Login
      </Link>
      <span className="h-5 w-px bg-neutral-300" />
      <RegisterButton />
    </div>
  );

  return (
    <header className="border-b border-neutral-300 py-4">
      <Container className="relative flex header-height-mobile lg:header-height-desktop items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="header-logo-mobile lg:header-logo-desktop" />
        </Link>

        {showSearch ? (
          <div className="hidden w-25vw max-w-none sm:block">
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
            <div className="search-wrap-mobile">
              <SearchBar defaultValue={searchDefaultValue} placeholder={searchPlaceholder} />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
