export interface Author {
  id: number;
  name: string;
  username?: string;
  email?: string;
  headline?: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string | null;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
}

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  headline?: string;
  avatarUrl?: string;
}

export interface PostsByUsernameResponse extends PaginatedResponse<BlogPost> {
  user: UserProfile;
}
