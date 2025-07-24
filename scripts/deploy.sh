#!/bin/bash

# 全アプリケーションのビルド・デプロイスクリプト
# 使用法: ./scripts/deploy.sh [target]
# target: all, website, production

set -e

TARGET=${1:-all}

echo "🐹 ハム太郎がデプロイを開始するのだ！"
echo "🎯 ターゲット: $TARGET"

# 共通ライブラリをビルド
echo "📦 共通ライブラリをビルド中..."
yarn workspace @junkifurukawa/shared run build

# 振り返りアプリをビルド
echo "🤖 振り返り執事をビルド中..."
cd packages/retrobutler-app
npm run build
cp -r dist/ ../website/retrobutler/
cd ../../

case $TARGET in
    "all")
        echo "🚀 全アプリケーションをビルド中..."
        yarn workspaces run build
        
        echo "✅ 全アプリケーションのビルドが完了したのだ！"
        echo "📂 Webサイトの配信準備完了: packages/website/"
        echo "📂 React Apps: find packages/ -name 'build' -type d"
        ;;
    
    "website")
        echo "🌐 メインWebサイトをデプロイ準備中..."
        
        # 振り返りアプリをビルド
        echo "🤖 振り返り執事をビルド中..."
        cd packages/retrobutler-app
        npm run build
        cd ../../
        
        # GitHub Pagesの場合はルートにファイルをコピー
        if [ "$2" = "github-pages" ]; then
            echo "📄 GitHub Pages用にファイルをコピー中..."
            cp packages/website/index.html ./
            cp -r packages/website/assets ./assets 2>/dev/null || true
            cp -r packages/retrobutler-app/dist ./retrobutler
            
            # 振り返りアプリのパスを修正
            sed -i.bak 's|href="/vite.svg"|href="./vite.svg"|g' retrobutler/index.html
            rm -f retrobutler/index.html.bak
            
            echo "✅ GitHub Pagesデプロイ準備完了なのだ！"
        fi
        ;;
    
    "production")
        echo "🏭 本番環境用ビルド中..."
        NODE_ENV=production yarn workspaces run build
        
        echo "🗂️  ビルド結果をアーカイブ中..."
        mkdir -p dist
        
        # 各アプリのビルド結果をdistディレクトリに集約
        for app in packages/*/; do
            app_name=$(basename "$app")
            if [ -d "$app/build" ]; then
                cp -r "$app/build" "dist/$app_name"
                echo "📦 $app_name のビルド結果をコピー"
            elif [ -d "$app/dist" ]; then
                cp -r "$app/dist" "dist/$app_name"
                echo "📦 $app_name のビルド結果をコピー"
            fi
        done
        
        echo "✅ 本番用ビルドが完了したのだ！"
        echo "📂 デプロイ用ファイル: dist/"
        ;;
    
    *)
        echo "❌ 不明なターゲット: $TARGET"
        echo "利用可能: all, website, production"
        exit 1
        ;;
esac

echo "🎉 デプロイ処理が完了したのだ！" 