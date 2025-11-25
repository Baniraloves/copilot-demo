# デモ実行ガイド

このドキュメントでは、GitHub Copilotのデモを実行する手順を説明します。

## 🚀 初回セットアップ

### 1. バックエンドのセットアップ

```bash
cd backend

# 仮想環境を作成（Windowsの場合）
python -m venv venv
venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# サーバーを起動
uvicorn main:app --reload
```

ブラウザで http://localhost:8000 にアクセスし、API が起動していることを確認します。

### 2. フロントエンドのセットアップ

```bash
cd frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:5173 にアクセスし、アプリが表示されることを確認します。

### 3. テストのセットアップ

```bash
cd tests

# 依存関係をインストール
npm install

# Playwrightのブラウザをインストール
npx playwright install

# テストを実行
npm test
```

## 🎬 デモシナリオ

### シナリオ1: 基本機能のデモ

1. **Todoの追加**
   - フロントエンドでTodoを追加
   - DevToolsでAPIリクエストを確認

2. **Todoの完了/未完了切り替え**
   - チェックボックスをクリック
   - 状態が更新されることを確認

3. **Todoの削除**
   - 削除ボタンをクリック
   - Todoが削除されることを確認

### シナリオ2: Playwrightテストのデモ

```bash
cd tests

# UIモードでテストを実行（視覚的でわかりやすい）
npm run test:ui

# または、ヘッドモードで実行
npm run test:headed
```

以下のテストケースが実行されます:
- ページの表示確認
- Todoの追加
- Todoの完了/未完了切り替え
- Todoの削除
- 統計表示の確認
- バリデーション確認

### シナリオ3: GitHub Copilot Chat デモ

VS Codeで以下のプロンプトを試してください:

```
@workspace Todoアプリの構造を説明してください
```

```
#file:App.tsx この検索機能を追加してください
```

```
#file:main.py このAPIエンドポイントにページネーションを追加してください
```

### シナリオ4: Issue → PR のデモ

#### 4-1. Issueの作成

1. GitHubリポジトリで「Issues」タブを開く
2. 「New Issue」をクリック
3. 「Feature Request」テンプレートを選択
4. 例: 「Todo編集機能を追加」

**Issue内容例**:
```markdown
## 機能の説明
既存のTodoを編集できる機能を追加してください。

## 要件
- Todoアイテムをダブルクリックすると編集モードになる
- タイトルと説明を編集できる
- 編集完了後、PUTエンドポイントを使用してバックエンドに送信
- Escキーで編集をキャンセルできる
- Enterキーで保存できる

## 参考ファイル
- frontend/src/App.tsx
- backend/main.py (PUT エンドポイントは既に実装済み)
```

#### 4-2. Copilotに割り当て

1. 作成したIssueを開く
2. 右サイドバーの「Assignees」で「@copilot」を選択
3. Copilotが自動でコードを生成し、PRを作成するのを待つ

#### 4-3. PRのレビュー

1. 生成されたPRを開く
2. 「Files changed」タブで変更内容を確認
3. コメント欄で「@copilot please review this PR」と入力
4. Copilotがレビューコメントを返す

### シナリオ5: GitHub Copilot Workspace デモ

1. GitHub上でIssueを開く
2. 「Open in Copilot Workspace」をクリック
3. Copilotが提案する実装計画を確認
4. 計画を承認してコード生成を開始
5. 生成されたコードをレビューしてPRを作成

## 📝 デモ用Issue候補

`issue-templates/README.md` に以下のIssue候補を用意しています:

1. ✏️ **Todo編集機能** - 簡単、視覚的にわかりやすい（推奨）
2. 🔍 **検索・フィルター機能** - UI拡張、状態管理
3. 🗂️ **カテゴリ/タグ機能** - データモデルの拡張
4. 💾 **SQLiteデータベース対応** - バックエンドの大幅変更
5. ⏰ **期限・優先度機能** - 新しいフィールドの追加
6. 🌓 **ダークモード切り替え** - UI/UX改善
7. 🔄 **ソート機能** - シンプルなUI機能
8. 🧪 **E2Eテストの拡張** - Playwright活用
9. ⚠️ **エラーハンドリング改善** - UX向上
10. 🧪 **ユニットテスト追加** - pytest活用

## 🎯 推奨デモフロー

### 短時間デモ (15分)

1. **基本機能の紹介** (3分)
   - アプリの起動と動作確認
   - CRUD操作のデモ

2. **Playwrightテスト** (5分)
   - UIモードでテスト実行
   - テスト結果の確認

3. **Copilot Chat** (7分)
   - コード説明のリクエスト
   - 簡単な機能追加の提案

### 標準デモ (30分)

1. **プロジェクト紹介** (5分)
   - アーキテクチャ説明
   - 技術スタック紹介

2. **基本機能デモ** (5分)
   - CRUD操作
   - API確認

3. **Playwrightテスト** (7分)
   - テスト実行
   - レポート確認

4. **Issue → PR フロー** (13分)
   - Issueの作成
   - Copilotへの割り当て
   - PR自動生成
   - レビュー依頼

### フルデモ (60分)

1. **プロジェクト紹介** (10分)
2. **基本機能デモ** (10分)
3. **Copilot Chat活用** (15分)
   - コード生成
   - リファクタリング
   - テスト生成
4. **GitHub Copilot Workspace** (15分)
   - Issue作成
   - 実装計画確認
   - コード生成
   - PR作成
5. **Playwrightテスト** (10分)

## 🔧 トラブルシューティング

### バックエンドが起動しない

```bash
# Pythonバージョン確認（3.8以上が必要）
python --version

# 仮想環境が有効化されているか確認
where python

# 依存関係を再インストール
pip install -r requirements.txt --upgrade
```

### フロントエンドが起動しない

```bash
# Node.jsバージョン確認（16以上が必要）
node --version

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### テストが失敗する

```bash
# サーバーが起動しているか確認
curl http://localhost:8000
curl http://localhost:5173

# Playwrightを再インストール
npx playwright install --with-deps
```

### CORSエラーが発生する

`backend/main.py` のCORS設定を確認:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📚 参考資料

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)

## 💡 デモのコツ

1. **事前準備**: デモ前に必ずすべてのサーバーを起動して動作確認
2. **Issue準備**: デモで使用するIssueをあらかじめ下書きしておく
3. **タイミング**: Copilotの応答には時間がかかる場合があるので余裕を持つ
4. **フォールバック**: ネットワーク問題に備えて録画を用意
5. **インタラクティブ**: 観客からのリクエストに応じてIssueを作成するのも効果的
