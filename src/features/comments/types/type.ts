export type CommentAuthor = {
  id: number;
  name: string;
  email?: string;
  headline?: string | null;
  avatarUrl?: string | null;
};

export type Comment = {
  id: number;
  content: string;
  author: CommentAuthor;
  post?: { id: number };
  createdAt: string;
};
