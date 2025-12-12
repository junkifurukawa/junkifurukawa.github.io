# デザインガイドライン

このリポジトリ内の全てのサービスで共通利用されるデザインガイドラインです。

## 基本方針

- **統一性**: 全てのサービスで一貫したデザインを保つ
- **シンプル**: 無駄を省き、使いやすいUIを提供
- **アクセシビリティ**: 誰でも使いやすいデザインを心がける

## フォント

- **フォントファミリー**: Noto Sans JP
- **読み込み方法**: Google Fontsから読み込む
- **フォントウェイト**: 400（通常）、500（中）、700（太字）

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
```

## カラーパレット

- **プライマリテキスト**: `text-gray-800` (#1f2937)
- **セカンダリテキスト**: `text-gray-600` (#4b5563)
- **リンク**: `text-blue-600` (#2563eb)
- **リンクホバー**: `text-blue-700` (#1d4ed8)
- **ボーダー**: `border-gray-200` (#e5e7eb)
- **背景**: `bg-white` (白)

## ナビゲーション

### トップページへの戻るリンク

**必須要件**: 全てのサービス（ツール）ページには、トップページ（`index.html`）への戻るリンクを配置すること。

#### デザイン仕様

- **配置**: ページの上部（ヘッダー内またはヘッダーの直下）
- **テキスト**: 「← ふるじゅんの道具箱に戻る」または「← トップに戻る」
- **スタイル**: 
  - フォントサイズ: `text-sm` または `text-base`
  - 色: `text-gray-600`
  - ホバー時: `hover:text-gray-800`
  - アイコン: 左矢印（←）を使用

#### 実装例

```html
<header class="mb-8">
  <a href="../" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4">
    <span class="mr-1">←</span>
    ふるじゅんの道具箱に戻る
  </a>
  <!-- その他のヘッダーコンテンツ -->
</header>
```

または、より目立たせたい場合：

```html
<nav class="mb-8 pb-4 border-b border-gray-200">
  <a href="../" class="inline-flex items-center text-base text-gray-600 hover:text-gray-800 font-medium">
    <span class="mr-2">←</span>
    ふるじゅんの道具箱に戻る
  </a>
</nav>
```

#### パス指定の注意点

- ルートの`index.html`から見たパス: `./` または `index.html`
- サブディレクトリ（例: `retrobutler/`）から見たパス: `../` または `../index.html`
- `packages/`配下のサービスから見たパス: `../../` または `../../index.html`

## レイアウト

- **最大幅**: `max-w-6xl` (1152px)
- **中央揃え**: `mx-auto`
- **パディング**: `p-8` (デスクトップ)、`p-4` (モバイル)

## ボタン・リンク

### プライマリリンク
- **スタイル**: `text-blue-600 hover:text-blue-700 font-semibold`
- **トランジション**: `transition-colors`

### セカンダリリンク
- **スタイル**: `text-gray-600 hover:text-gray-800`
- **トランジション**: `transition-colors`

## カードデザイン

ツールカードの標準スタイル：

```html
<div class="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
  <!-- カードコンテンツ -->
</div>
```

## レスポンシブデザイン

- **モバイルファースト**: モバイルを基準にデザイン
- **ブレークポイント**: 
  - `md:` (768px以上)
  - `lg:` (1024px以上)

## アニメーション・トランジション

- **ホバーエフェクト**: `transition-all` または `transition-colors`
- **カードホバー**: `hover:-translate-y-1` (上に4px移動)
- **影の変化**: `hover:shadow-lg`

## 実装チェックリスト

新しいサービスを追加する際は、以下を確認：

- [ ] Noto Sans JPフォントが適用されている
- [ ] トップページへの戻るリンクが配置されている
- [ ] カラーパレットが統一されている
- [ ] レスポンシブデザインに対応している
- [ ] ホバーエフェクトが適切に設定されている

## 参考

- メインページ: `index.html`
- 振り返り執事: `packages/retrobutler-app/`

