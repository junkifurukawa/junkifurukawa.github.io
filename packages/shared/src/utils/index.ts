/**
 * 日付をフォーマットする関数
 */
export const formatDate = (date: Date, locale: string = 'ja-JP'): string => {
  return date.toLocaleDateString(locale);
};

/**
 * URLの検証を行う関数
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 配列をシャッフルする関数
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}; 