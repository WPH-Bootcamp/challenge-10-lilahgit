import Container from "@/components/Container";
import CommentsSectionClient from "@/components/CommentsSectionClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  HomeDesktopActions,
  HomeMobileActions,
} from "@/components/HomeHeaderActions";
import PostCard from "@/components/PostCard";
import PostMeta from "@/components/PostMeta";
import PostStats from "@/components/PostStats";
import Tag from "@/components/Tag";
import {
  getPost,
  getPostComments,
  getRecommended,
} from "@/features/posts/services/postsServices";
import type { BlogPost } from "@/features/posts/types/type";
import type { ReactNode } from "react";

type DetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ liked?: string; comments?: string }>;
};

const RECOMMENDED_LIMIT = 2;

function DetailLayout({ children }: { children: ReactNode }) {
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

function PostHero({ post, liked }: { post: BlogPost; liked: boolean }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-neutral-900">{post.title}</h1>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Tag key={`${post.id}-${tag}`} label={tag} />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PostMeta author={post.author} createdAt={post.createdAt} />
        <PostStats
          likes={post.likes}
          comments={post.comments}
          highlightLike={liked}
          commentHref="#comments"
        />
      </div>
    </div>
  );
}

function PostCover({ post }: { post: BlogPost }) {
  return (
    <div className="detail-cover relative w-full overflow-hidden rounded-xl bg-neutral-100">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
          No image
        </div>
      )}
    </div>
  );
}

function PostContent({ content }: { content: string }) {
  return (
    <div
      className="editor-preview text-neutral-700"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function AnotherPostsSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Another Post</h3>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default async function DetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const liked = resolvedSearchParams.liked === "1";
  const showAllComments = resolvedSearchParams.comments === "all";

  const [post, comments, recommended] = await Promise.all([
    getPost(resolvedParams.id),
    getPostComments(resolvedParams.id),
    getRecommended(1, RECOMMENDED_LIMIT),
  ]);

  const anotherPosts = recommended.data
    .filter((item) => item.id !== post.id)
    .slice(0, RECOMMENDED_LIMIT);

  return (
    <DetailLayout>
      <Container>
        <article className="mx-auto max-w-3xl space-y-6">
          <PostHero post={post} liked={liked} />
          <PostCover post={post} />
          <PostContent content={post.content} />
          <CommentsSectionClient
            initialComments={comments}
            showAll={showAllComments}
            postId={resolvedParams.id}
          />
          <AnotherPostsSection posts={anotherPosts} />
        </article>
      </Container>
    </DetailLayout>
  );
}
