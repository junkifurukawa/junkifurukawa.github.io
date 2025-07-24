# Junki Furukawa's Personal Website Monorepo

このリポジトリは Junki Furukawa の個人ウェブサイトと関連プロジェクトを管理するmonorepo構成なのだ！

## プロジェクト構成

### 📁 packages/website
静的なメインウェブサイト（HTML/CSS/JavaScript）
- GitHub Pagesでホストされる個人サイト
- シンプルなポートフォリオサイト

### 📁 packages/like-button  
React TypeScriptで作成されたいいねボタンコンポーネント
- 再利用可能なUIコンポーネント
- TypeScript + React 18

## 開発環境のセットアップ

依存関係をインストール：
```bash
yarn install
```

全プロジェクトの開発サーバーを起動：
```bash
yarn dev
```

全プロジェクトをビルド：
```bash
yarn build
```

テストを実行：
```bash
yarn test
```

## 各プロジェクトの個別操作

websiteの開発サーバー起動：
```bash
cd packages/website
```
```bash
yarn dev
```

like-buttonの開発サーバー起動：
```bash
cd packages/like-button
```
```bash
yarn start
```

## 技術スタック

- **Monorepo管理**: Yarn Workspaces
- **フロントエンド**: React 18 + TypeScript
- **静的サイト**: 純粋なHTML/CSS/JS
- **ホスティング**: GitHub Pages

## 📚 さらに詳しい情報

- 📖 [開発ガイド](./DEVELOPMENT.md) - 詳細な開発手順とベストプラクティス
- 🚀 [新しいアプリの作成方法](./DEVELOPMENT.md#新しいアプリケーションの作成)
- 🔧 [デプロイメント手順](./DEVELOPMENT.md#デプロイメント)

---

🐹 ハム太郎が管理しているリポジトリなのだ！
