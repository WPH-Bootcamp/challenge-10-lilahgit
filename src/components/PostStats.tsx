import { Heart, MessageCircle } from "lucide-react";

type PostStatsProps = {
  likes: number;
  comments: number;
  highlightLike?: boolean;
};

export default function PostStats({ likes, comments, highlightLike = false }: PostStatsProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-neutral-600">
      <span className={`flex items-center gap-1.5 ${highlightLike ? "text-primary-300" : ""}`}>
        <Heart className="h-4 w-4" aria-hidden="true" />
        {likes}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {comments}
      </span>
    </div>
  );
}

