# Junki Furukawa's Personal Website Monorepo

このリポジトリは Junki Furukawa の個人ウェブサイトと関連プロジェクトを管理するmonorepo構成なのだ！

## プロジェクト構成

### 📁 packages/website
静的なメインウェブサイト（HTML/CSS/JavaScript）
- GitHub Pagesでホストされる個人サイト
- シンプルなポートフォリオサイト

## セットアップ

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

## 各プロジェクトの操作

websiteの開発サーバー起動：
```bash
cd packages/website
```
```bash
yarn dev
```

## 技術スタック

- **Monorepo管理**: Yarn Workspaces
- **フロントエンド**: React 18 + TypeScript
- **静的サイト**: 純粋なHTML/CSS/JS
- **ホスティング**: GitHub Pages

---

🐹 ハム太郎が管理しているリポジトリなのだ！
