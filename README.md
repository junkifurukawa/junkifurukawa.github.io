# Junki Furukawa's Personal Website Monorepo

このリポジトリは Junki Furukawa の雑で便利なサービスを社内公開しています！

## デザインガイドライン

全てのサービスで共通利用されるデザインガイドラインは [design-guideline.md](./design-guideline.md) に記載されています。
新しいサービスを追加する際は、必ずガイドラインを確認してください。

## プロジェクト構成

### 📁 packages/website
静的なメインウェブサイト（HTML/CSS/JavaScript）

## セットアップ

各プロジェクトの依存関係をインストール：
```bash
cd packages/retrobutler-app
npm install
```

開発サーバー起動：
```bash
cd packages/retrobutler-app
npm run dev
```

ビルド：
```bash
cd packages/retrobutler-app
npm run build
```

## 技術スタック
- **フロントエンド**: React 18 + TypeScript
- **静的サイト**: 純粋なHTML/CSS/JS
- **ホスティング**: GitHub Pages
