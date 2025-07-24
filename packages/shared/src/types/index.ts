/**
 * 基本的なAPIレスポンス型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * ユーザー情報の型
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 共通のプロジェクト情報型
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
  status: 'active' | 'archived' | 'draft';
  createdAt: Date;
} 