export interface BlogComment {
  id: string;
  postSlug: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface BlogLike {
  postSlug: string;
  count: number;
  lastUpdated: string;
}
