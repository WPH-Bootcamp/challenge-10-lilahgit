import type { Author } from "@/features/posts/types/type";
import type { CommentAuthor } from "@/features/comments/types/type";
import { formatDate } from "@/lib/format";

type PostMetaProps = {
  author: Author | CommentAuthor;
  createdAt: string;
};

export default function PostMeta({ author, createdAt }: PostMetaProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-neutral-500">
      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-neutral-200">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="h-7 w-7 object-cover"
          />
        ) : (
          <span className="text-3xs font-semibold text-neutral-600">
            {author.name?.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <span className="font-medium text-neutral-700">{author.name}</span>
      <span className="h-1 w-1 rounded-full bg-neutral-300" />
      <span>{formatDate(createdAt)}</span>
    </div>
  );
}
