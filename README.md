# GitHub Copilot デモ - Todoアプリ

このリポジトリは、GitHub Copilotの機能をデモするためのシンプルなTodoアプリケーションです。

## 🎯 デモのポイント

- **Issue割り当て**: CopilotにIssueを割り当てて自動解決
- **Pull Requestレビュー**: Copilotによるコードレビュー
- **Playwrightテスト**: E2Eテストの自動生成と実行
- **Copilot Chat**: インタラクティブなコード生成

## 🛠 技術スタック

### Backend
- **FastAPI** (Python): 高速で現代的なWeb APIフレームワーク
- **uvicorn**: ASGIサーバー
- **CORS対応**: フロントエンドとの連携

### Frontend
- **React 18**: UIライブラリ
- **Vite**: 高速なビルドツール
- **TypeScript**: 型安全性

### Testing
- **Playwright**: E2Eテストフレームワーク

## 📦 プロジェクト構成

```
copilot-demo/
├── backend/           # FastAPI バックエンド
│   ├── main.py       # APIエンドポイント
│   └── requirements.txt
├── frontend/         # React フロントエンド
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── tests/            # Playwrightテスト
    └── e2e/
```

## 🚀 セットアップ

### バックエンド

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

バックエンドは `http://localhost:8000` で起動します。

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

### テスト実行

```bash
cd tests
npm install
npx playwright install
npx playwright test
```

## 📝 API エンドポイント

- `GET /api/todos` - 全てのTodoを取得
- `POST /api/todos` - 新しいTodoを作成
- `PUT /api/todos/{id}` - Todoを更新
- `DELETE /api/todos/{id}` - Todoを削除

## 🎬 デモシナリオ

### 1. 基本機能
- Todoの追加、削除、完了状態の切り替え

### 2. GitHub Copilot活用例
- Issue: "検索機能を追加" → Copilotに割り当て
- Issue: "編集機能を追加" → Copilotに割り当て
- PR: レビュー依頼 → Copilotがレビュー

### 3. 今後の拡張機能候補
- [ ] Todo編集機能
- [ ] 検索・フィルター機能
- [ ] カテゴリ/タグ機能
- [ ] SQLiteデータベース連携
- [ ] ユーザー認証

## 📄 ライセンス

MIT License
