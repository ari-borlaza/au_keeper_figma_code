export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  id: string;
  name: string;
  socials: AuthorSocial[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface AuthorSocial {
  id: string;
  authorId: string;
  platform: 'twitter' | 'tiktok' | 'ao3' | 'wattpad' | 'tumblr' | 'instagram' | 'other';
  handle: string;
  link: string;
}

export interface Story {
  id: string;
  title: string;
  authorId: string;
  author: Author;
  source: 'twitter' | 'tiktok' | 'ao3' | 'wattpad' | 'tumblr' | 'instagram' | 'other';
  ships: string[];
  type: string[]; // fluff, angst, hurt/comfort, etc.
  category: 'full-length' | 'one-shot' | 'short' | 'spin-off';
  chaptersCount: number;
  status: 'completed' | 'ongoing' | 'on-hold' | 'long-time-no-update' | 'discontinued';
  summary: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ReadList {
  id: string;
  name: string;
  userId: string;
  isDefault: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadListItem {
  id: string;
  readListId: string;
  storyId: string;
  story: Story;
  addedAt: Date;
  isRead: boolean;
}

export interface Discussion {
  id: string;
  storyId: string;
  userId: string;
  user: User;
  content: string;
  chapterNumber?: number;
  quote?: string;
  visibility: 'public' | 'followers' | 'private-group';
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryFilters {
  search?: string;
  authorId?: string;
  source?: string;
  ships?: string[];
  type?: string[];
  category?: string;
  status?: string;
  sortBy?: 'title' | 'author' | 'createdAt' | 'updatedAt' | 'chaptersCount';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalStoriesRead: number;
  totalAuthorsRead: number;
  currentlyReading: number;
  totalStories: number;
  totalAuthors: number;
}