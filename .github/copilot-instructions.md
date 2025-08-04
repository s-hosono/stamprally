# GitHub Copilot カスタム指示

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## プロジェクトについて

このプロジェクトは **デジタルスタンプラリーアプリケーション** です。

### 技術スタック
- **フロントエンド**: React 19 + TypeScript + Vite
- **ルーティング**: React Router v7
- **スタイリング**: CSS Modules / Styled Components
- **地図**: Leaflet + React Leaflet
- **QRコード**: html5-qrcode
- **HTTP通信**: Axios

### 主要機能
1. **スタンプ収集機能** - QRコードを読み取ってスタンプを獲得
2. **地図表示機能** - スタンプポイントの位置を地図で表示
3. **スタンプ一覧表示** - 獲得したスタンプの表示・管理
4. **ユーザー管理** - ユーザー登録・ログイン機能
5. **進捗表示** - スタンプラリーの進捗状況表示

### コーディング指示
- TypeScriptの型安全性を重視してください
- 関数型コンポーネントとHooksを使用してください
- レスポンシブデザインを考慮してください
- アクセシビリティを意識した実装をしてください
- エラーハンドリングを適切に実装してください
- モバイルファーストでUIを設計してください

### ディレクトリ構造
```
src/
├── components/     # 再利用可能なコンポーネント
├── pages/         # ページコンポーネント
├── hooks/         # カスタムフック
├── types/         # TypeScript型定義
├── utils/         # ユーティリティ関数
├── store/         # 状態管理
└── assets/        # 静的ファイル
```
