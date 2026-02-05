"use client";

import Link from "next/link";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

type PostStatsProps = {
  likes: number;
  comments: number;
  highlightLike?: boolean;
  commentHref?: string;
  onLikeToggle?: (liked: boolean) => void;
};

export default function PostStats({
  likes,
  comments,
  highlightLike = false,
  commentHref,
  onLikeToggle,
}: PostStatsProps) {
  const [liked, setLiked] = useState(highlightLike);
  const [likeCount, setLikeCount] = useState(likes);

  useEffect(() => {
    setLiked(highlightLike);
  }, [highlightLike]);

  useEffect(() => {
    setLikeCount(likes);
  }, [likes]);

  const handleLikeClick = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    onLikeToggle?.(nextLiked);
  };

  return (
    <div className="flex items-center gap-4 text-xs text-neutral-600">
      <button
        type="button"
        onClick={handleLikeClick}
        className={`flex items-center gap-1.5 ${liked ? "text-accent-primary-300" : ""}`}
        aria-pressed={liked}
      >
        <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} aria-hidden="true" />
        {likeCount}
      </button>
      {commentHref ? (
        <Link href={commentHref} className="flex items-center gap-1.5 hover:text-primary-300">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {comments}
        </Link>
      ) : (
        <span className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {comments}
        </span>
      )}
    </div>
  );
}

