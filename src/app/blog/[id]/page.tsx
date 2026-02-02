import { AuthHeaderActions, MobileAvatarAction } from "@/components/AuthHeaderActions";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostMeta from "@/components/PostMeta";
import PostStats from "@/components/PostStats";
import Tag from "@/components/Tag";
import { getPostById, getPostComments, getRecommendedPosts } from "@/lib/api";
import type { BlogPost, Comment } from "@/types/blog";
import Link from "next/link";
import type { ReactNode } from "react";

type DetailPageProps = {
  params: { id: string };
  searchParams?: { liked?: string; comments?: string };
};

const RECOMMENDED_LIMIT = 2;

function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-25">
      <Header rightSlot={<AuthHeaderActions />} mobileActions={<MobileAvatarAction />} />
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
        <PostStats likes={post.likes} comments={post.comments} highlightLike={liked} />
      </div>
    </div>
  );
}

function PostCover({ post }: { post: BlogPost }) {
  return (
    <div className="detail-cover relative w-full overflow-hidden rounded-xl bg-neutral-100">
      {post.imageUrl ? (
        <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
          No image
        </div>
      )}
    </div>
  );
}

function PostContent({ content }: { content: string }) {
  const paragraphs = content.split("\n").filter(Boolean);

  return (
    <div className="prose max-w-none text-neutral-700">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function CommentComposer() {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-neutral-600">Give your Comment</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Enter your comment"
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="button"
          className="rounded-full bg-primary-300 px-6 py-3 text-sm font-semibold text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function CommentsSection({ comments, showAll, postId }: { comments: Comment[]; showAll: boolean; postId: string }) {
  const visibleComments = showAll ? comments : comments.slice(0, 3);
  const showSeeAll = !showAll && comments.length > 3;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900">Comments({comments.length})</h2>
      <CommentComposer />
      <div className="space-y-4">
        {comments.length === 0 ? (
          <EmptyState title="No comments yet" description="Be the first to share your thoughts." />
        ) : (
          visibleComments.map((comment) => (
            <div key={comment.id} className="space-y-2 border-b border-neutral-200 pb-4 last:border-b-0">
              <PostMeta author={comment.author} createdAt={comment.createdAt} />
              <p className="text-sm text-neutral-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      {showSeeAll ? (
        <Link href={`/blog/${postId}?comments=all`} className="text-sm font-semibold text-primary-300">
          See all comments
        </Link>
      ) : null}
    </section>
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

export default async function DetailPage({ params, searchParams }: DetailPageProps) {
  const liked = searchParams?.liked === "1";
  const showAllComments = searchParams?.comments === "all";

  const [post, comments, recommended] = await Promise.all([
    getPostById(params.id),
    getPostComments(params.id),
    getRecommendedPosts(1, RECOMMENDED_LIMIT),
  ]);

  const anotherPosts = recommended.data.filter((item) => item.id !== post.id).slice(0, RECOMMENDED_LIMIT);

  return (
    <DetailLayout>
      <Container>
        <article className="mx-auto max-w-3xl space-y-6">
          <PostHero post={post} liked={liked} />
          <PostCover post={post} />
          <PostContent content={post.content} />
          <CommentsSection comments={comments} showAll={showAllComments} postId={params.id} />
          <AnotherPostsSection posts={anotherPosts} />
        </article>
      </Container>
    </DetailLayout>
  );
}
