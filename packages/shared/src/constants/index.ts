/**
 * アプリケーション共通の定数
 */
export const APP_CONFIG = {
  DEFAULT_LOCALE: 'ja-JP',
  DATE_FORMAT: 'yyyy/MM/dd',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

/**
 * API関連の定数
 */
export const API_ENDPOINTS = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.junkifurukawa.com' 
    : 'http://localhost:3001',
  TIMEOUT: 10000,
} as const;

/**
 * 色のテーマ定数
 */
export const THEME_COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
} as const; 