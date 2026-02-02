import { AuthHeaderActions, MobileAvatarAction } from "@/components/AuthHeaderActions";
import Container from "@/components/Container";
import DocumentIcon from "@/components/DocumentIcon";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { getPostsByUsername } from "@/lib/api";
import type { PostsByUsernameResponse } from "@/types/blog";

type VisitProfileProps = {
  params: { username: string };
  searchParams?: { page?: string; state?: string };
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
        <h2 className="text-base font-semibold text-neutral-900">{data.user.name}</h2>
        <p className="text-sm text-neutral-600">{data.user.headline ?? "Frontend Developer"}</p>
      </div>
    </div>
  );
}

export default async function VisitProfilePage({ params, searchParams }: VisitProfileProps) {
  const page = Number(searchParams?.page ?? "1");
  const forceEmpty = searchParams?.state === "empty";
  const data = await getPostsByUsername(params.username, page, 6);
  const posts = forceEmpty ? [] : data.data;
  const totalPosts = forceEmpty ? 0 : data.total;

  return (
    <div className="min-h-screen bg-neutral-25">
      <Header rightSlot={<AuthHeaderActions />} mobileActions={<MobileAvatarAction />} />
      <main className="py-10">
        <Container>
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <UserHeader data={data} />
            <p className="text-sm font-semibold text-neutral-900">{totalPosts} Post</p>

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
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
