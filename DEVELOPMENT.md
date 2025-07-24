# 🐹 ハム太郎のMonorepo開発ガイド

このドキュメントは、複数のアプリケーションを効率的に開発するためのガイドなのだ！

## 🏗️ アーキテクチャ概要

```
junkifurukawa.github.io/
├── packages/
│   ├── shared/           # 共通ライブラリ・ユーティリティ
│   ├── website/          # メインの静的サイト
│   ├── like-button/      # Reactコンポーネント
│   └── [新しいアプリ]/    # 今後追加するアプリ
├── scripts/              # 開発・デプロイスクリプト
└── package.json          # Monorepo設定
```

## 🚀 新しいアプリケーションの作成

### 1. アプリ作成スクリプトを使用

Reactアプリを作成：
```bash
yarn create-app my-new-app react
```

Next.jsアプリを作成：
```bash
yarn create-app my-dashboard nextjs
```

静的サイトを作成：
```bash
yarn create-app my-landing static
```

Express.jsサーバーを作成：
```bash
yarn create-app my-api express
```

### 2. 手動でアプリを作成

packages/ 配下にディレクトリを作成：
```bash
mkdir packages/my-custom-app
```

package.jsonを作成：
```bash
cd packages/my-custom-app
```
```bash
npm init -y
```

その後の手順：
1. package.jsonの name を `@junkifurukawa/my-custom-app` に変更
2. 必要な依存関係をインストール  
3. ルートディレクトリで yarn install を実行：
```bash
cd ../..
```
```bash
yarn install
```

## 📦 共通ライブラリの使用

### sharedパッケージをアプリで使用する

アプリディレクトリに移動：
```bash
cd packages/your-app
```

sharedパッケージを追加：
```bash
yarn add @junkifurukawa/shared@*
```

```typescript
// TypeScriptアプリでの使用例
import { formatDate, ApiResponse, THEME_COLORS } from '@junkifurukawa/shared';

const formattedDate = formatDate(new Date());
const primaryColor = THEME_COLORS.PRIMARY;
```

### 共通ライブラリに新機能を追加

sharedパッケージのソースディレクトリに移動：
```bash
cd packages/shared/src
```

ファイルを編集した後、ルートディレクトリに戻る：
```bash
cd ../../..
```

ビルドして他のパッケージで利用可能にする：
```bash
yarn build-shared
```

## 🔧 開発ワークフロー

### 日常の開発コマンド

全プロジェクトの依存関係をインストール：
```bash
yarn install-all
```

特定のアプリディレクトリに移動：
```bash
cd packages/your-app
```

開発サーバーを起動：
```bash
yarn dev
```

全アプリの開発サーバーを起動（要注意：ポート競合の可能性）：
```bash
yarn dev
```

特定のアプリだけテスト：
```bash
yarn workspace @junkifurukawa/your-app run test
```

全アプリをビルド：
```bash
yarn build
```

### 推奨開発フロー

1. **機能開発前**

新しいブランチを作成：
```bash
git checkout -b feature/new-feature
```

依存関係をインストール：
```bash
yarn install-all
```

2. **共通機能を追加する場合**

共通ライブラリディレクトリに移動：
```bash
cd packages/shared
```

ファイルを編集した後、ビルド：
```bash
yarn build
```

他のアプリディレクトリに移動：
```bash
cd ../your-app
```

開発サーバーを起動：
```bash
yarn dev
```

3. **新しいアプリを追加する場合**

新しいアプリを作成：
```bash
yarn create-app new-app react
```

アプリディレクトリに移動：
```bash
cd packages/new-app
```

開発サーバーを起動：
```bash
yarn dev
```

## 🚀 デプロイメント

### GitHub Pagesにwebsiteをデプロイ

websiteをGitHub Pages用に準備：
```bash
./scripts/deploy.sh website github-pages
```

変更をステージング：
```bash
git add .
```

コミット：
```bash
git commit -m "Deploy website"
```

プッシュ：
```bash
git push origin main
```

### 本番環境向けビルド

全アプリを本番用にビルド：
```bash
./scripts/deploy.sh production
```

ビルド結果を確認：
```bash
ls dist/
```

## 📁 ディレクトリ構造のベストプラクティス

### 各アプリのpackage.json

```json
{
  "name": "@junkifurukawa/your-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "開発サーバー起動コマンド",
    "build": "本番用ビルドコマンド",
    "test": "テスト実行コマンド",
    "clean": "ビルド成果物削除コマンド"
  }
}
```

### 推奨ディレクトリ構造

```
packages/your-app/
├── src/                  # ソースコード
├── public/              # 静的ファイル
├── build/ or dist/      # ビルド結果
├── package.json         # パッケージ設定
├── README.md           # アプリ固有のREADME
└── .env.example        # 環境変数のサンプル
```

## 🔄 依存関係管理

### Workspaces間の依存関係

```bash
# パッケージAがパッケージBを参照する場合
cd packages/package-a
yarn add @junkifurukawa/package-b@*

# 依存関係を更新
yarn install
```

### 外部パッケージの管理

```bash
# 特定のアプリに依存関係を追加
yarn workspace @junkifurukawa/your-app add package-name

# 全アプリで共通の依存関係をルートに追加
yarn add -W package-name
```

## 🧪 テスト戦略

### アプリ単位でのテスト

```bash
# 特定のアプリのテスト
yarn workspace @junkifurukawa/your-app run test

# 全アプリのテスト
yarn test
```

### 共通ライブラリのテスト

```bash
# sharedパッケージのテスト
yarn workspace @junkifurukawa/shared run test
```

## 🎯 パフォーマンス最適化

### ビルド時間の短縮

1. **増分ビルド**: 変更されたパッケージのみビルド
2. **並列実行**: 可能な限り並列でタスクを実行
3. **キャッシュ活用**: node_modules や dist のキャッシュを活用

### 本番環境での最適化

1. **Tree Shaking**: 未使用コードの削除
2. **Code Splitting**: 必要な部分のみロード
3. **Static Asset Optimization**: 画像・CSS・JSの最適化

---

🐹 **ハム太郎からのアドバイス**: 新しいアプリを作る時は、まず小さく始めて、共通機能は `shared` パッケージに抽出するのがおすすめなのだ！ 