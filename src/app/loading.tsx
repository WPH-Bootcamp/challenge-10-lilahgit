import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { PostListSkeleton } from "@/components/Skeletons";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-25">
      <Header />
      <main className="py-8">{children}</main>
      <Footer />
    </div>
  );
}

function MostLikedSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-3/4 rounded-full bg-neutral-100" />
      <div className="h-4 w-2/3 rounded-full bg-neutral-100" />
      <div className="h-4 w-1/2 rounded-full bg-neutral-100" />
    </div>
  );
}

export default function Loading() {
  return (
    <HomeLayout>
      <Container className="grid gap-10 lg:grid-cols-[1fr,280px]">
        <section className="space-y-6">
          <SectionHeading title="Recommend For You" />
          <PostListSkeleton />
        </section>
        <aside className="space-y-4">
          <SectionHeading title="Most Liked" />
          <MostLikedSkeleton />
        </aside>
      </Container>
    </HomeLayout>
  );
}

