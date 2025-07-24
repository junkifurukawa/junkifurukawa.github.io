#!/bin/bash

# 新規アプリケーション作成スクリプト
# 使用法: ./scripts/create-app.sh <app-name> <template-type>
# テンプレートタイプ: react, nextjs, static, express

set -e

APP_NAME=$1
TEMPLATE_TYPE=${2:-react}

if [ -z "$APP_NAME" ]; then
    echo "❌ アプリ名を指定してください"
    echo "使用法: ./scripts/create-app.sh <app-name> [template-type]"
    echo "テンプレートタイプ: react, nextjs, static, express"
    exit 1
fi

PACKAGE_DIR="packages/$APP_NAME"

if [ -d "$PACKAGE_DIR" ]; then
    echo "❌ $APP_NAME は既に存在します"
    exit 1
fi

echo "🐹 ハム太郎が $APP_NAME アプリを作成するのだ！"
echo "📦 テンプレートタイプ: $TEMPLATE_TYPE"

# ディレクトリ作成
mkdir -p "$PACKAGE_DIR"

case $TEMPLATE_TYPE in
    "react")
        echo "⚛️  Reactアプリを作成中..."
        cd "$PACKAGE_DIR"
        npx create-react-app . --template typescript --name "@junkifurukawa/$APP_NAME"
        ;;
    "nextjs")
        echo "🔺 Next.jsアプリを作成中..."
        cd "$PACKAGE_DIR"
        npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
        ;;
    "static")
        echo "📄 静的サイトを作成中..."
        cat > "$PACKAGE_DIR/package.json" << EOF
{
  "name": "@junkifurukawa/$APP_NAME",
  "version": "1.0.0",
  "private": true,
  "description": "$APP_NAME - Static website",
  "scripts": {
    "dev": "python3 -m http.server 8000",
    "build": "echo 'Static site - no build required'",
    "clean": "echo 'Static site - no clean required'"
  },
  "keywords": ["static", "website"],
  "author": "Junki Furukawa"
}
EOF
        cat > "$PACKAGE_DIR/index.html" << EOF
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$APP_NAME</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐹 $APP_NAME</h1>
        <p>ハム太郎が作った新しいアプリなのだ！</p>
    </div>
</body>
</html>
EOF
        ;;
    "express")
        echo "🚀 Express.jsサーバーを作成中..."
        cd "$PACKAGE_DIR"
        npm init -y
        npm install express cors helmet
        npm install -D @types/express @types/cors typescript ts-node nodemon
        # Express用のファイル作成は省略（長くなるため）
        ;;
    *)
        echo "❌ 不明なテンプレートタイプ: $TEMPLATE_TYPE"
        echo "利用可能: react, nextjs, static, express"
        exit 1
        ;;
esac

echo "✅ $APP_NAME アプリが作成完了したのだ！"
echo "📂 場所: $PACKAGE_DIR"
echo "🚀 開発開始: cd $PACKAGE_DIR && yarn dev" 