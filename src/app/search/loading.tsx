import { AuthHeaderActions, MobileAvatarAction } from "@/components/AuthHeaderActions";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PostListSkeleton } from "@/components/Skeletons";

function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-25">
      <Header rightSlot={<AuthHeaderActions />} mobileActions={<MobileAvatarAction />} showMobileSearch />
      <main className="py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default function Loading() {
  return (
    <SearchLayout>
      <Container className="mx-auto max-w-4xl space-y-6">
        <div className="h-5 w-1/3 rounded-full bg-neutral-100" />
        <PostListSkeleton />
      </Container>
    </SearchLayout>
  );
}

