import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  HomeDesktopActions,
  HomeMobileActions,
} from "@/components/HomeHeaderActions";
import { DetailSkeleton } from "@/components/Skeletons";

function DetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-25">
      <Header
        rightSlot={<HomeDesktopActions />}
        mobileActions={<HomeMobileActions />}
      />
      <main className="py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default function Loading() {
  return (
    <DetailLayout>
      <Container>
        <div className="mx-auto max-w-3xl">
          <DetailSkeleton />
        </div>
      </Container>
    </DetailLayout>
  );
}
