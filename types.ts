
export enum AppView {
  HOME = 'home',
  FEED = 'feed',
  LIBRARY = 'library',
  ABOUT = 'about',
  ARTICLE = 'article',
  EDITOR = 'editor',
  DASHBOARD = 'dashboard',
  LOGIN = 'login'
}

export type Category = 'Pensamento' | 'Escrita' | 'Biblioteca' | 'Projeto';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  email: string;
  bio: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  date: string;
  readTime: string;
  imageUrl: string;
  author: Author;
  likes: number;
  commentsCount: number;
  published: boolean;
  // Book specific fields
  bookInfo?: {
    title: string;
    author: string;
    rating: number;
    status: 'Lendo' | 'Lido' | 'Quero Ler';
    coverUrl?: string;
  };
  projectInfo?: {
    status: 'Em Desenvolvimento' | 'Concluído' | 'Pausado';
    techStack: string[];
    link?: string;
    github?: string;
  };
  thoughtInfo?: {
    coreInsight: string;
    inspirationSource?: string;
  };
  writingInfo?: {
    genre: string;
    targetAudience?: string;
  };
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  text: string;
  likes: number;
  replies?: Comment[];
  isAuthor?: boolean;
}
