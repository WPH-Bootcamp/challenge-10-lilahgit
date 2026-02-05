export type Pagination<T> = {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  username?: string;
  headline?: string | null;
  avatarUrl?: string | null;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string | null;
  imagePublicId: string | null;
  createdAt: string;
  likes: number;
  comments: number;
  author: Author;
};

export type LikeUser = {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string;
};

export type PostsByUsernameResponse = {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
  user: {
    id: number;
    name: string;
    username: string;
    headline: string | null;
    avatarUrl: string | null;
  };
};

export type PostsByUserIdResponse = {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    headline: string | null;
    avatarUrl: string | null;
  };
};

export type DeleteResponse = {
  success: true;
};

export type BlogPost = Post;
export type PaginatedResponse<T> = Pagination<T>;