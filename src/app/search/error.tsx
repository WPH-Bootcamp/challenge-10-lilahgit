"use client";

import Container from "@/components/Container";
import ErrorState from "@/components/ErrorState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  HomeDesktopActions,
  HomeMobileActions,
} from "@/components/HomeHeaderActions";

function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-25">
      <Header
        rightSlot={<HomeDesktopActions />}
        mobileActions={<HomeMobileActions />}
        showMobileSearch
      />
      <main className="py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default function Error({ reset }: { reset: () => void }) {
  return (
    <SearchLayout>
      <Container className="mx-auto max-w-4xl">
        <ErrorState onRetry={reset} />
      </Container>
    </SearchLayout>
  );
}

