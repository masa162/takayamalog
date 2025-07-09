# 高山まさあきの夜遊び研究所 - 開発環境設定

## プロジェクト概要

- **プロジェクト名**: 高山まさあきの夜遊び研究所
- **ドメイン**: takayamalog.com
- **GitHubリポジトリ**: https://github.com/masa162/takayamalog
- **サイトタイプ**: 個人ブランド型アダルトコンテンツサイト
- **主要コンテンツ**: 風俗体験談、FANZA動画レビュー

## 技術スタック

- **Frontend**: Next.js 15.3.5 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel
- **Domain**: takayamalog.com (Namecheap)
- **Styling**: Tailwind CSS 4
- **Analytics**: Google Analytics 4

## 完了した作業（Phase 1: 基本環境構築）

### 1.1 開発環境セットアップ

- ✅ Next.js 14プロジェクトの初期化
- ✅ TypeScript設定
- ✅ ESLint・Prettier設定
- ✅ Tailwind CSS導入
- ✅ GitHub Actionsの設定

### セットアップ内容

1. **Next.js 15.3.5プロジェクト作成**
   - App Router対応
   - TypeScript対応
   - Tailwind CSS統合
   - Turbopack有効化

2. **TypeScript設定**
   - ES2022ターゲット
   - strict モード有効
   - パス設定 (@/\*)

3. **ESLint・Prettier設定**
   - Next.js推奨設定
   - TypeScript対応
   - Prettier統合
   - カスタムルール追加

4. **Tailwind CSS設定**
   - カスタムカラーパレット
   - 研究所テーマ用CSSクラス
   - レスポンシブデザイン対応

5. **GitHub Actions設定**
   - CI/CDパイプライン
   - 自動デプロイ（Vercel）
   - 品質チェック（ESLint、Prettier、TypeScript）

## 開発環境セットアップ

### 必要なツール

```bash
# Node.js 20以上
node --version

# npm
npm --version

# Git
git --version
```

### プロジェクト起動

```bash
# リポジトリクローン
git clone https://github.com/masa162/takayamalog.git
cd takayamalog

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.localを編集

# 開発サーバー起動
npm run dev
```

## 環境変数設定

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# FANZA API
FANZA_API_ID=your_fanza_api_id
FANZA_AFFILIATE_ID=your_fanza_affiliate_id

# 年齢確認
NEXT_PUBLIC_AGE_VERIFICATION_ENABLED=true
```

## プロジェクト構造

```
src/
├── app/
│   ├── layout.tsx              # Root Layout
│   ├── page.tsx                # Home Page
│   ├── globals.css             # Global Styles
│   ├── loading.tsx             # Loading UI
│   ├── error.tsx               # Error UI
│   ├── not-found.tsx           # 404 Page
│   ├── age-verification/       # 年齢確認
│   ├── fuzoku/                 # 風俗体験談
│   ├── fanza/                  # FANZA動画レビュー
│   ├── about/                  # 研究所について
│   ├── contact/                # お問い合わせ
│   └── api/                    # API Routes
├── components/
│   ├── ui/                     # 基本UIコンポーネント
│   ├── layout/                 # レイアウトコンポーネント
│   ├── content/                # コンテンツコンポーネント
│   └── features/               # 機能別コンポーネント
├── lib/
│   ├── supabase/               # Supabase関連
│   ├── utils/                  # ユーティリティ
│   └── hooks/                  # カスタムフック
├── types/                      # TypeScript型定義
└── styles/                     # スタイル関連
```

## 重要なコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint

# リント修正
npm run lint:fix

# フォーマット
npm run format

# フォーマットチェック
npm run format:check

# テスト実行
npm run test
```

## 完了した作業（Phase 1.2）

### 1.2 Supabaseセットアップ

- ✅ Supabaseプロジェクト作成
- ✅ データベース設計の実装
- ✅ Row Level Security (RLS) 設定
- ✅ 認証システムの基本設定

### セットアップ詳細

1. **Supabaseクライアント設定**
   - @supabase/ssr パッケージ導入
   - クライアントサイド・サーバーサイド対応
   - ミドルウェア統合

2. **データベース設計**
   - 6つの主要テーブル作成
   - インデックス最適化
   - 関連テーブル設計

3. **Row Level Security設定**
   - 全テーブルのRLS有効化
   - 管理者・一般ユーザーの権限分離
   - 公開コンテンツのアクセス制御

4. **認証システム**
   - プロフィール管理
   - 管理者セッション追跡
   - 認証フック・コンテキスト

### データベーステーブル

- **articles**: 記事情報
- **categories**: カテゴリ情報
- **establishments**: 風俗店舗情報
- **fanza_works**: FANZA作品情報
- **page_views**: アクセス統計
- **affiliate_clicks**: アフィリエイトクリック統計

## 次の作業（Phase 1.3）

### 1.3 デプロイメント準備

- [ ] Vercelアカウント設定
- [ ] NamecheapドメインのVercel連携
- [ ] Supabaseプロジェクトの本番環境作成
- [ ] 環境変数の設定
- [ ] 本番環境へのデプロイ

## 品質保証

### パフォーマンス目標

- **LCP**: 2.5秒以内
- **FID**: 100ms以内
- **CLS**: 0.1以内

### 現在のビルド状況

- ✅ コンパイル成功
- ✅ 型チェック完了
- ✅ 静的生成対応
- ⚠️ ESLint警告2件（関数の戻り値型）

## 備考

- このプロジェクトは成人向けコンテンツを含みます
- 法的要件に従って適切な年齢確認を実装予定
- アフィリエイトプログラムを使用した収益化予定
- 実体験に基づく信頼性の高い情報提供を心がけています
