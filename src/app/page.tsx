import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  HomeDesktopActions,
  HomeMobileActions,
} from "@/components/HomeHeaderActions";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/SectionHeading";
import { getMostLiked, getRecommended } from "@/features/posts/services/postsServices";
import type { BlogPost, PaginatedResponse } from "@/features/posts/types/type";

type HomeProps = {
  searchParams?: Promise<{ page?: string }>;
};

const RECOMMENDED_LIMIT = 5;
const MOST_LIKED_LIMIT = 3;

type HomeLayoutProps = {
  children: React.ReactNode;
};

function HomeLayout({ children }: HomeLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}

function HomeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        rightSlot={<HomeDesktopActions />}
        mobileActions={<HomeMobileActions hideSearch />}
      />
      <main className="py-12 justify-center overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}

type RecommendedSectionProps = {
  data: PaginatedResponse<BlogPost>;
};

function RecommendedSection({ data }: RecommendedSectionProps) {
  return (
      <section className="space-y-6">
        <SectionHeading title="Recommend For You" />
        <div className="space-y-6">
          {data.data.map((post) => (
            <PostCard key={post.id} post={post} hideImageOnMobile />
          ))}
        </div>
        <div className="home-list-divider mt-4 pt-4 lg:mt-6 lg:pt-6" />
      </section>
    );
  }

type MostLikedSectionProps = {
  data: PaginatedResponse<BlogPost>;
};

function MostLikedSection({ data }: MostLikedSectionProps) {
  return (
    <aside className="space-y-6 lg:border-l lg:border-neutral-200 lg:pl-5">
      <div className="lg:home-sidebar-sticky space-y-6">
      <SectionHeading title="Most Liked" className="display-xs font-bold" />
      <div className="space-y-5">
        {data.data.map((post) => (
          <PostCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
      </div>
    </aside>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const parsedPage = Number(resolvedSearchParams.page ?? "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  try {
    const [recommended, mostLiked] = await Promise.all([
      getRecommended(page, RECOMMENDED_LIMIT),
      getMostLiked(1, MOST_LIKED_LIMIT),
    ]);

    return (
      <HomeLayout>
        <HomeShell>
          <Container className="flex flex-col gap-10 lg:home-flex-desktop lg:flex-row">
            <div className="order-1 lg:order-none lg:home-main-col">
              <RecommendedSection data={recommended} />
            </div>
            <div className="order-3 lg:order-none lg:home-side-col">
              <MostLikedSection data={mostLiked} />
            </div>
          </Container>
          <div className="order-2 mt-6 lg:order-none">
            <Pagination page={recommended.page} lastPage={recommended.lastPage} basePath="/" />
          </div>
        </HomeShell>
      </HomeLayout>
    );
  } catch {
    return (
      <HomeLayout>
        <HomeShell>
          <Container>
            <EmptyState
              title="Failed to load posts"
              description="Please try again later."
            />
          </Container>
        </HomeShell>
      </HomeLayout>
    );
  }
}
