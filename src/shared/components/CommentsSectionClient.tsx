"use client";

import Link from "next/link";
import CommentComposer from "@/components/CommentComposer";
import EmptyState from "@/components/EmptyState";
import PostMeta from "@/components/PostMeta";
import { usePostComments } from "@/features/posts/hooks/usePosts";
import type { Comment } from "@/features/comments/types/type";

type CommentsSectionClientProps = {
  postId: string;
  initialComments: Comment[];
  showAll: boolean;
};

export default function CommentsSectionClient({
  postId,
  initialComments,
  showAll,
}: CommentsSectionClientProps) {
  const { data: comments = [] } = usePostComments(postId, {
    initialData: initialComments,
  });

  const visibleComments = showAll ? comments : comments.slice(0, 3);
  const showSeeAll = !showAll && comments.length > 3;

  return (
    <section id="comments" className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900">
        Comments({comments.length})
      </h2>
      <CommentComposer postId={postId} />
      <div className="space-y-4">
        {comments.length === 0 ? (
          <EmptyState
            title="No comments yet"
            description="Be the first to share your thoughts."
          />
        ) : (
          visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="space-y-2 border-b border-neutral-200 pb-4 last:border-b-0"
            >
              <PostMeta author={comment.author} createdAt={comment.createdAt} />
              <p className="text-sm text-neutral-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      {showSeeAll ? (
        <Link
          href={`/blog/${postId}?comments=all`}
          className="text-sm font-semibold text-primary-300"
        >
          See all comments
        </Link>
      ) : null}
    </section>
  );
}

