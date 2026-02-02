import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { clampText } from "@/lib/format";
import Tag from "@/components/Tag";
import PostMeta from "@/components/PostMeta";
import PostStats from "@/components/PostStats";

type PostCardProps = {
  post: BlogPost;
  variant?: "list" | "compact";
  hideImageOnMobile?: boolean;
};

export default function PostCard({ post, variant = "list", hideImageOnMobile = false }: PostCardProps) {
  if (variant === "compact") {
    return (
      <article className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
        <Link href={`/blog/${post.id}`} className="space-y-2">
          <h4 className="text-sm font-semibold text-neutral-900">{post.title}</h4>
          <p className="text-xs text-neutral-500">
            {clampText(post.content, 90)}
          </p>
          <PostStats likes={post.likes} comments={post.comments} />
        </Link>
      </article>
    );
  }

  return (
    <article className="grid gap-4 border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[240px,1fr]">
      <Link
        href={`/blog/${post.id}`}
        className={`relative h-40 w-full overflow-hidden rounded-xl bg-neutral-100 ${hideImageOnMobile ? "hidden sm:block" : ""}`}
      >
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </Link>
      <div className="space-y-3">
        <Link href={`/blog/${post.id}`}>
          <h3 className="text-lg font-semibold text-neutral-900">{post.title}</h3>
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((tag) => (
            <Tag key={`${post.id}-${tag}`} label={tag} />
          ))}
        </div>
        <p className="text-sm text-neutral-600">
          {clampText(post.content, 160)}
        </p>
        <div className="flex items-center justify-between">
          <PostMeta author={post.author} createdAt={post.createdAt} />
          <PostStats likes={post.likes} comments={post.comments} />
        </div>
      </div>
    </article>
  );
}

