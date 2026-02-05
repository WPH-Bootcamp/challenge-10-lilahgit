import Link from "next/link";
import type { BlogPost } from "@/features/posts/types/type";
import { clampText } from "@/lib/format";
import Tag from "@/components/Tag";
import PostMeta from "@/components/PostMeta";
import PostStats from "@/components/PostStats";

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

type PostCardProps = {
  post: BlogPost;
  variant?: "list" | "compact";
  hideImageOnMobile?: boolean;
};

export default function PostCard({
  post,
  variant = "list",
  hideImageOnMobile = false,
}: PostCardProps) {
  if (variant === "compact") {
    const previewText = stripHtml(post.content);
    return (
      <article className="border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0">
        <Link href={`/blog/${post.id}`} className="space-y-2">
          <h4 className="text-sm font-semibold text-neutral-900">
            {post.title}
          </h4>
          <p className="text-xs text-neutral-500">
            {clampText(previewText, 90)}
          </p>
          <PostStats likes={post.likes} comments={post.comments} />
        </Link>
      </article>
    );
  }

  const previewText = stripHtml(post.content);

  return (
    <article className="border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0">
      <div className="lg:w-250 flex flex-col gap-4 lg:flex-row lg:gap-6">
      <Link
        href={`/blog/${post.id}`}
        className={`relative w-85 h-64.5 radius-[6px] overflow-hidden ${hideImageOnMobile ? "hidden lg:block" : ""} ${hideImageOnMobile ? "lg:post-card-image" : "h-40 w-full rounded-md lg:post-card-image"}`}
      >
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </Link>
      <div className="flex-1 space-y-3">
        <Link href={`/blog/${post.id}`}>
          <h3 className="text-xl font-semibold text-neutral-900">
            {post.title}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((tag) => (
            <Tag key={`${post.id}-${tag}`} label={tag} />
          ))}
        </div>
        <p className="line-clamp-2 text-sm text-neutral-600">
          {previewText}
        </p>
        <div className="flex items-center justify-between">
          <PostMeta author={post.author} createdAt={post.createdAt} />
          <PostStats
            likes={post.likes}
            comments={post.comments}
            commentHref={`/blog/${post.id}#comments`}
          />
        </div>
      </div>
      </div>
    </article>
  );
}
