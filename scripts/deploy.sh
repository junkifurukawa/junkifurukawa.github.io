#!/bin/bash

# 全アプリケーションのビルド・デプロイスクリプト
# 使用法: ./scripts/deploy.sh [target]
# target: all, website, production

set -e

TARGET=${1:-all}

echo "🐹 デプロイを開始するのだ！"
echo "🎯 ターゲット: $TARGET"

# 振り返りアプリをビルド（共通処理）
build_retrobutler() {
    echo "🤖 振り返り執事をビルド中..."
    cd packages/retrobutler-app
    npm run build
    cp -r dist/ ../website/retrobutler/
    cd ../../
}

# Planning Pokerアプリをビルド（共通処理）
build_planning_poker() {
    echo "🃏 Planning Pokerをビルド中..."
    cd packages/planning-poker-app
    npm run build
    cp -r dist/ ../website/planning-poker/
    cd ../../
}

# メインWebサイトのCSSをビルド（共通処理）
build_website_css() {
    echo "🎨 メインWebサイトのCSSをビルド中..."
    cd packages/website
    npm run build
    cd ../../
}

case $TARGET in
    "all")
        echo "🚀 全アプリケーションをビルド中..."
        build_website_css
        build_retrobutler
        build_planning_poker
        
        echo "✅ 全アプリケーションのビルドが完了したのだ！"
        echo "📂 Webサイトの配信準備完了: packages/website/"
        echo "📂 React Apps: find packages/ -name 'build' -type d"
        ;;
    
    "website")
        echo "🌐 メインWebサイトをデプロイ準備中..."
        build_website_css
        build_retrobutler
        build_planning_poker
        
        # GitHub Pagesの場合はルートにファイルをコピー
        if [ "$2" = "github-pages" ]; then
            echo "📄 GitHub Pages用にファイルをコピー中..."
            cp packages/website/index.html ./
            mkdir -p dist
            cp -r packages/website/dist/styles.css ./dist/
            cp -r packages/retrobutler-app/dist ./retrobutler
            cp -r packages/planning-poker-app/dist ./planning-poker
            
            # 振り返りアプリのパスを修正（絶対パスを相対パスに変換）
            if [ -f retrobutler/index.html ]; then
                # macOS用のsedコマンド（-i '' を使用）
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' 's|href="/vite.svg"|href="./vite.svg"|g' retrobutler/index.html
                    sed -i '' 's|src="/|src="./|g' retrobutler/index.html
                    sed -i '' 's|href="/|href="./|g' retrobutler/index.html
                else
                    sed -i 's|href="/vite.svg"|href="./vite.svg"|g' retrobutler/index.html
                    sed -i 's|src="/|src="./|g' retrobutler/index.html
                    sed -i 's|href="/|href="./|g' retrobutler/index.html
                fi
            fi
            
            # Planning Pokerアプリのパスを修正（絶対パスを相対パスに変換）
            if [ -f planning-poker/index.html ]; then
                # macOS用のsedコマンド（-i '' を使用）
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' 's|href="/vite.svg"|href="./vite.svg"|g' planning-poker/index.html
                    sed -i '' 's|src="/|src="./|g' planning-poker/index.html
                    sed -i '' 's|href="/|href="./|g' planning-poker/index.html
                else
                    sed -i 's|href="/vite.svg"|href="./vite.svg"|g' planning-poker/index.html
                    sed -i 's|src="/|src="./|g' planning-poker/index.html
                    sed -i 's|href="/|href="./|g' planning-poker/index.html
                fi
            fi
            
            echo "✅ GitHub Pagesデプロイ準備完了なのだ！"
            echo "📝 次のステップ:"
            echo "   1. git add ."
            echo "   2. git commit -m 'Deploy to GitHub Pages'"
            echo "   3. git push origin main"
            echo "   4. GitHubのSettings > Pagesでmainブランチのルートを選択"
        fi
        ;;
    
    "production")
        echo "🏭 本番環境用ビルド中..."
        
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