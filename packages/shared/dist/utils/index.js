"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = exports.isValidUrl = exports.formatDate = void 0;
/**
 * 日付をフォーマットする関数
 */
const formatDate = (date, locale = 'ja-JP') => {
    return date.toLocaleDateString(locale);
};
exports.formatDate = formatDate;
/**
 * URLの検証を行う関数
 */
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
/**
 * 配列をシャッフルする関数
 */
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
exports.shuffleArray = shuffleArray;
//# sourceMappingURL=index.js.map