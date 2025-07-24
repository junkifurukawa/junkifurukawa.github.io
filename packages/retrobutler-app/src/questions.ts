export const MODES = {
  kpt: {
    time: "15-30分",
    feeling: "モヤモヤしてる",
    purpose: "問題解決したい",
    questions: [
      "良かったこと・続けたいことは？",
      "問題だったこと・課題は？", 
      "次に試してみたいことは？"
    ]
  },
  ywt: {
    time: "10-20分",
    feeling: "充実してる",
    purpose: "学びを抽出したい",
    questions: [
      "今日やったことは？",
      "そこからわかったことは？",
      "次にやりたいことは？"
    ]
  },
  fourF: {
    time: "20-40分",
    feeling: "感情的になってる",
    purpose: "感情も含めて整理したい",
    questions: [
      "実際に起こったことは？",
      "そのときどう感じた？",
      "そこから何を発見した？",
      "今後どうしていく？"
    ]
  },
  fourLs: {
    time: "20-30分",
    feeling: "混乱してる",
    purpose: "多角的に分析したい",
    questions: [
      "良かったこと・気に入ったことは？",
      "学んだこと・新しい発見は？",
      "足りなかったこと・欠けていたことは？",
      "欲しかったもの・望んでいたことは？"
    ]
  },
  gibbs: {
    time: "30-45分",
    feeling: "落ち込み気味",
    purpose: "体系的に深く考えたい",
    questions: [
      "何が起こったか詳しく教えて",
      "そのときの感情や反応は？",
      "良い点と悪い点は何だった？",
      "なぜそうなったと思う？",
      "そこから何を学んだ？",
      "次回はどうする？"
    ]
  },
  simple: {
    time: "15-25分",
    feeling: "さっぱりしたい",
    purpose: "シンプルに整理したい",
    questions: [
      "何が起こった？何に気づいた？",
      "それはどういう意味がある？",
      "これから何をする？"
    ]
  },
  positive: {
    time: "5-10分",
    feeling: "疲れ気味",
    purpose: "ポジティブに振り返りたい",
    questions: [
      "今日起きた印象的なことは？",
      "そこから気づいたことは？",
      "その気づきから得た教訓は？",
      "理想の自分になるための宣言は？"
    ]
  }
} as const;

export type ModeKey = keyof typeof MODES;

// スコアリング用の選択肢
export const FEELING_OPTIONS = [
  "モヤモヤしてる",
  "充実してる", 
  "感情的になってる",
  "混乱してる",
  "落ち込み気味",
  "さっぱりしたい",
  "疲れ気味"
] as const;

export const PURPOSE_OPTIONS = [
  "問題を解決したい",
  "学びを整理したい",
  "感情を整理したい",
  "全体を把握したい",
  "詳しく分析したい",
  "シンプルに整理したい",
  "前向きになりたい"
] as const;

export const TIME_OPTIONS = [
  "5-15分",
  "15-30分", 
  "30分以上"
] as const;

// スコアリング関数
export function calculateScore(
  mode: typeof MODES[ModeKey],
  userFeeling: string,
  userPurpose: string,
  userTime: string
): number {
  let score = 0;
  
  // feeling マッチ (40点)
  if (mode.feeling === userFeeling) {
    score += 40;
  }
  
  // purpose マッチ (35点)
  if (mode.purpose.includes(userPurpose.replace("したい", ""))) {
    score += 35;
  }
  
  // 時間制約マッチ (25点)
  const modeTimeRange = mode.time;
  if (isTimeCompatible(modeTimeRange, userTime)) {
    score += 25;
  }
  
  return score;
}

function isTimeCompatible(modeTime: string, userTime: string): boolean {
  const modeMinutes = getMaxTime(modeTime);
  const userMaxMinutes = getMaxTime(userTime);
  
  return modeMinutes <= userMaxMinutes;
}

function getMaxTime(timeRange: string): number {
  if (timeRange.includes("5-15")) return 15;
  if (timeRange.includes("15-30")) return 30;
  if (timeRange.includes("30分以上")) return 60;
  
  // モードの時間から最大値を抽出
  const matches = timeRange.match(/(\d+)[-分]/g);
  if (matches) {
    const numbers = matches.map(m => parseInt(m.replace(/[^0-9]/g, "")));
    return Math.max(...numbers);
  }
  
  return 30; // デフォルト
}

// メイン関数：推奨手法を取得
export function getRecommendations(feeling: string, purpose: string, time: string) {
  const modeEntries = Object.entries(MODES);
  
  const scored = modeEntries.map(([key, mode]) => {
    let score = 0;
    
    // 気分スコア (40点満点)
    if (mode.feeling === feeling) {
      score += 40;
    }
    
    // 目的スコア (35点満点)
    if (mode.purpose === purpose) {
      score += 35;
    }
    
    // 時間スコア (25点満点)
    if (isTimeCompatible(mode.time, time)) {
      score += 25;
    }
    
    return {
      key,
      mode,
      score
    };
  });
  
  // スコア順でソート
  return scored.sort((a, b) => b.score - a.score);
} 