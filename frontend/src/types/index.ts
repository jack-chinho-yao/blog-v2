export interface UserResponse {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  role: 'ADMIN' | 'AUTHOR' | 'READER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface TypeResponse {
  id: number;
  name: string;
  blogCount: number;
}

export interface TagResponse {
  id: number;
  name: string;
  blogCount: number;
}

export interface BlogSummaryResponse {
  id: number;
  title: string;
  firstPicture: string;
  flag: string;
  description: string;
  views: number;
  recommend: boolean;
  type: TypeResponse;
  tags: TagResponse[];
  user: UserResponse;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse extends BlogSummaryResponse {
  content: string;
  appreciation: boolean;
  shareStatement: boolean;
  commentable: boolean;
  published: boolean;
}

export interface CommentResponse {
  id: number;
  nickname: string;
  email: string;
  content: string;
  avatar: string;
  adminComment: boolean;
  createdAt: string;
  replies: CommentResponse[];
}

export interface ArchiveResponse {
  year: number;
  blogs: BlogSummaryResponse[];
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

// Request types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface BlogRequest {
  title: string;
  content: string;
  firstPicture?: string;
  flag?: string;
  description?: string;
  typeId: number;
  tagIds?: number[];
  appreciation: boolean;
  shareStatement: boolean;
  commentable: boolean;
  published: boolean;
  recommend: boolean;
}

export interface CommentRequest {
  nickname: string;
  email?: string;
  content: string;
  blogId: number;
  parentCommentId?: number;
}
