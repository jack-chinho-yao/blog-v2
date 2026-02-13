import type {
  AuthResponse,
  LoginRequest,
  BlogResponse,
  BlogSummaryResponse,
  BlogRequest,
  TypeResponse,
  TagResponse,
  CommentResponse,
  CommentRequest,
  ArchiveResponse,
  Page,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return undefined as T;
    }

    return res.json();
  }

  // Auth
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await this.request('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Blogs (Public)
  async getBlogs(page = 0, size = 8): Promise<Page<BlogSummaryResponse>> {
    return this.request(`/api/blogs?page=${page}&size=${size}&sort=updatedAt,desc`);
  }

  async getBlog(id: number): Promise<BlogResponse> {
    return this.request(`/api/blogs/${id}`);
  }

  async searchBlogs(query: string, page = 0): Promise<Page<BlogSummaryResponse>> {
    return this.request(`/api/blogs/search?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async getRecommendBlogs(size = 8): Promise<BlogSummaryResponse[]> {
    return this.request(`/api/blogs/recommend?size=${size}`);
  }

  async getBlogsByType(typeId: number, page = 0): Promise<Page<BlogSummaryResponse>> {
    return this.request(`/api/blogs/type/${typeId}?page=${page}`);
  }

  async getBlogsByTag(tagId: number, page = 0): Promise<Page<BlogSummaryResponse>> {
    return this.request(`/api/blogs/tag/${tagId}?page=${page}`);
  }

  async getArchives(): Promise<ArchiveResponse[]> {
    return this.request('/api/blogs/archive');
  }

  async getBlogCount(): Promise<number> {
    return this.request('/api/blogs/count');
  }

  // Types
  async getTypes(): Promise<TypeResponse[]> {
    return this.request('/api/types');
  }

  async getTopTypes(size = 6): Promise<TypeResponse[]> {
    return this.request(`/api/types/top?size=${size}`);
  }

  // Tags
  async getTags(): Promise<TagResponse[]> {
    return this.request('/api/tags');
  }

  async getTopTags(size = 10): Promise<TagResponse[]> {
    return this.request(`/api/tags/top?size=${size}`);
  }

  // Comments
  async getComments(blogId: number): Promise<CommentResponse[]> {
    return this.request(`/api/comments/blog/${blogId}`);
  }

  async createComment(data: CommentRequest): Promise<CommentResponse> {
    return this.request('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin - Blogs
  async adminGetBlogs(page = 0, size = 10): Promise<Page<BlogSummaryResponse>> {
    return this.request(`/api/admin/blogs?page=${page}&size=${size}`);
  }

  async adminGetBlog(id: number): Promise<BlogResponse> {
    return this.request(`/api/admin/blogs/${id}`);
  }

  async adminCreateBlog(data: BlogRequest): Promise<BlogResponse> {
    return this.request('/api/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateBlog(id: number, data: BlogRequest): Promise<BlogResponse> {
    return this.request(`/api/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminDeleteBlog(id: number): Promise<void> {
    return this.request(`/api/admin/blogs/${id}`, { method: 'DELETE' });
  }

  // Admin - Types
  async adminCreateType(name: string): Promise<TypeResponse> {
    return this.request('/api/admin/types', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async adminUpdateType(id: number, name: string): Promise<TypeResponse> {
    return this.request(`/api/admin/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async adminDeleteType(id: number): Promise<void> {
    return this.request(`/api/admin/types/${id}`, { method: 'DELETE' });
  }

  // Admin - Tags
  async adminCreateTag(name: string): Promise<TagResponse> {
    return this.request('/api/admin/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async adminUpdateTag(id: number, name: string): Promise<TagResponse> {
    return this.request(`/api/admin/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async adminDeleteTag(id: number): Promise<void> {
    return this.request(`/api/admin/tags/${id}`, { method: 'DELETE' });
  }

  // Admin - Comments
  async adminDeleteComment(id: number): Promise<void> {
    return this.request(`/api/admin/comments/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
