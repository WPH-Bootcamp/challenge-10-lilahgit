import Container from "@/components/Container";
import DocumentIcon from "@/components/DocumentIcon";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  HomeDesktopActions,
  HomeMobileActions,
} from "@/components/HomeHeaderActions";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getPostsByUsername } from "@/features/posts/services/postsServices";
import type { PostsByUsernameResponse } from "@/features/posts/types/type";

type VisitProfileProps = {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ page?: string; state?: string }>;
};

function UserHeader({ data }: { data: PostsByUsernameResponse }) {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-200 pb-4">
      <div className="h-14 w-14 overflow-hidden rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
        <span className="flex h-full w-full items-center justify-center">
          {data.user.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          {data.user.name}
        </h2>
        <p className="text-sm text-neutral-600">
          {data.user.headline ?? "Frontend Developer"}
        </p>
      </div>
    </div>
  );
}

export default async function VisitProfilePage({
  params,
  searchParams,
}: VisitProfileProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const parsedPage = Number(resolvedSearchParams.page ?? "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const forceEmpty = resolvedSearchParams.state === "empty";
  const data = await getPostsByUsername(resolvedParams.username, page, 6);
  const posts = forceEmpty ? [] : data.data;
  const totalPosts = forceEmpty ? 0 : data.total;

  return (
    <div className="min-h-screen bg-neutral-25">
      <Header
        rightSlot={<HomeDesktopActions />}
        mobileActions={<HomeMobileActions />}
      />
      <main className="py-10">
        <Container>
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <UserHeader data={data} />
            <p className="text-sm font-semibold text-neutral-900">
              {totalPosts} Post
            </p>

            {posts.length === 0 ? (
              <div className="flex min-h-empty items-center justify-center">
                <EmptyState
                  variant="centered"
                  icon={<DocumentIcon />}
                  title="No posts from this user yet"
                  description="Stay tuned for future posts"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} hideImageOnMobile />
                ))}
                <Pagination
                  page={data.page}
                  lastPage={data.lastPage}
                  basePath={`/user/${resolvedParams.username}`}
                  extraParams={{ state: resolvedSearchParams.state }}
                />
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
