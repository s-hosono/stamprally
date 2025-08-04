# デジタルスタンプラリー

街を歩いてQRコードをスキャンし、スタンプを集めるデジタルスタンプラリーアプリケーションです。

## 🌟 機能

- **📱 QRコードスキャン** - カメラでQRコードを読み取ってスタンプを獲得
- **🗺️ 地図表示** - スタンプポイントの位置をインタラクティブな地図で確認
- **🏆 スタンプコレクション** - 獲得したスタンプを美しいUIで管理・表示
- **📍 位置情報連携** - GPS情報でスタンプポイント周辺での取得を制限
- **📊 進捗管理** - カテゴリー別の収集状況とクリア率を表示

## 🛠️ 技術スタック

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Map**: Leaflet + React Leaflet
- **QR Scanner**: html5-qrcode
- **Styling**: CSS Modules
- **HTTP Client**: Axios

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18.x以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd stamprally

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ESLintでコードチェック
npm run lint

# ビルドしたアプリのプレビュー
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── components/     # 再利用可能なUIコンポーネント
│   ├── Button.tsx
│   ├── Layout.tsx
│   └── Navigation.tsx
├── pages/         # ページコンポーネント
│   ├── HomePage.tsx
│   ├── ScanPage.tsx
│   ├── MapPage.tsx
│   └── StampsPage.tsx
├── hooks/         # カスタムフック
│   ├── useGeolocation.ts
│   └── useQRScanner.ts
├── types/         # TypeScript型定義
│   └── index.ts
├── utils/         # ユーティリティ関数
│   └── helpers.ts
├── store/         # 状態管理
│   └── AppContext.tsx
└── assets/        # 静的ファイル
```

## 🎯 使い方

1. **ホーム画面** - アプリの概要と進捗状況を確認
2. **QRスキャン** - カメラでスタンプポイントのQRコードを読み取り
3. **地図** - スタンプポイントの位置と獲得状況を地図で確認
4. **コレクション** - 獲得したスタンプの一覧と詳細情報を表示

## 🎨 UI/UX 特徴

- **モバイルファースト** - スマートフォンでの使用を最優先に設計
- **レスポンシブデザイン** - あらゆるデバイスサイズに対応
- **アクセシビリティ** - WAIガイドラインに準拠したUIを実装
- **直感的操作** - 分かりやすいアイコンとナビゲーション

## 🔧 カスタマイズ

### スタンプポイントの追加

`src/pages/` 内の各ページファイルで `sampleStampPoints` 配列を編集してください。

### スタイルの変更

各コンポーネントに対応する CSS ファイルを編集してデザインをカスタマイズできます。

## 📱 対応環境

- **ブラウザ**: Chrome, Firefox, Safari, Edge (最新版)
- **デバイス**: スマートフォン, タブレット, デスクトップ
- **OS**: iOS, Android, Windows, macOS, Linux

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 📞 お問い合わせ

プロジェクトに関するご質問や提案がございましたら、Issue を作成してください。
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
