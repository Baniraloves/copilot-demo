import { test, expect } from "@playwright/test";

test.describe("Todo App E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // テスト前にページにアクセス
    await page.goto("/");
  });

  test("ページタイトルとヘッダーが表示される", async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/Todo App/);

    // ヘッダーの確認
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Todo App"
    );
    await expect(page.getByText("GitHub Copilot Demo")).toBeVisible();
  });

  test("新しいTodoを追加できる", async ({ page }) => {
    // Todoのタイトル入力
    const titleInput = page.getByPlaceholder("タイトルを入力...");
    await titleInput.fill("テストTodo");

    // 説明を入力
    const descInput = page.getByPlaceholder("説明 (オプション)");
    await descInput.fill("これはテスト用のTodoです");

    // 追加ボタンをクリック
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されたことを確認
    await expect(
      page.getByRole("heading", { level: 3, name: "テストTodo" })
    ).toBeVisible();
    await expect(page.getByText("これはテスト用のTodoです")).toBeVisible();

    // 入力フィールドがクリアされることを確認
    await expect(titleInput).toHaveValue("");
    await expect(descInput).toHaveValue("");
  });

  test("Todoを完了済みにできる", async ({ page }) => {
    // まずTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("完了テスト");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "完了テスト" })).toBeVisible();

    // この特定のTodoのチェックボックスをクリック
    const todoItem = page.locator(".todo-item").filter({ hasText: "完了テスト" }).first();
    const checkbox = todoItem.getByRole("checkbox");
    await checkbox.check();

    // チェックボックスがチェックされたことを確認
    await expect(checkbox).toBeChecked();
  });

  test("Todoを削除できる", async ({ page }) => {
    // まずTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("削除テスト");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "削除テスト" })).toBeVisible();

    // この特定のTodoの削除ボタンをクリック
    const todoItem = page.locator(".todo-item").filter({ hasText: "削除テスト" });
    await todoItem.getByRole("button", { name: "削除" }).click();

    // Todoが削除されたことを確認
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "削除テスト" })).not.toBeVisible();
  });

  test("複数のTodoを追加して統計が正しく表示される", async ({ page }) => {
    // 3つのTodoを追加
    const todos = [
      { title: "統計Todo 1", description: "最初のTodo" },
      { title: "統計Todo 2", description: "2番目のTodo" },
      { title: "統計Todo 3", description: "3番目のTodo" },
    ];

    for (const todo of todos) {
      await page.getByPlaceholder("タイトルを入力...").fill(todo.title);
      await page.getByPlaceholder("説明 (オプション)").fill(todo.description);
      await page.getByRole("button", { name: "追加" }).click();
      await page.waitForTimeout(500); // API呼び出しを待つ
    }

    // 統計にこれらのTodoが反映されていることを確認（最低3件は含まれる）
    await expect(page.getByText(/合計: \d+ 件/)).toBeVisible();
    
    // 1つを完了にする
    const todoItem = page.locator(".todo-item").filter({ hasText: "統計Todo 1" }).first();
    await todoItem.getByRole("checkbox").check();
    await page.waitForTimeout(500);

    // 統計が更新されることを確認
    await expect(page.getByText(/完了: \d+ 件/)).toBeVisible();
  });

  test("空のタイトルではTodoを追加できない", async ({ page }) => {
    // 追加ボタンが無効化されていることを確認
    const addButton = page.getByRole("button", { name: "追加" });
    await expect(addButton).toBeDisabled();

    // スペースのみの入力でも無効
    await page.getByPlaceholder("タイトルを入力...").fill("   ");
    await expect(addButton).toBeDisabled();
  });

  test("Todoを編集できる", async ({ page }) => {
    // まずTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("編集前のタイトル");
    await page.getByPlaceholder("説明 (オプション)").fill("編集前の説明");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "編集前のタイトル" })).toBeVisible();

    // この特定のTodoの編集ボタンをクリック
    const todoItem = page.locator(".todo-item").filter({ hasText: "編集前のタイトル" });
    await todoItem.getByRole("button", { name: "編集" }).click();

    // 編集フォームが表示されることを確認
    const titleInput = page
      .locator(".edit-form input.input-title")
      .first();
    const descInput = page
      .locator(".edit-form input.input-description")
      .first();

    await expect(titleInput).toBeVisible();
    await expect(descInput).toBeVisible();

    // 値を編集
    await titleInput.clear();
    await titleInput.fill("編集後のタイトル");
    await descInput.clear();
    await descInput.fill("編集後の説明");

    // 保存ボタンをクリック
    await page.getByRole("button", { name: "保存" }).click();

    // 編集内容が反映されることを確認
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "編集後のタイトル" })).toBeVisible();
    await expect(page.getByText("編集後の説明")).toBeVisible();
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "編集前のタイトル" })).not.toBeVisible();
  });

  test("Todo編集をキャンセルできる", async ({ page }) => {
    // まずTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("キャンセルテスト");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByText("キャンセルテスト")).toBeVisible();

    // 編集ボタンをクリック
    await page.getByRole("button", { name: "編集" }).first().click();

    // 編集フォームが表示されることを確認
    const titleInput = page
      .locator(".edit-form input.input-title")
      .first();
    await expect(titleInput).toBeVisible();

    // 値を変更
    await titleInput.clear();
    await titleInput.fill("変更したタイトル");

    // キャンセルボタンをクリック
    await page.getByRole("button", { name: "キャンセル" }).click();

    // 元のタイトルが表示されることを確認
    await expect(page.getByText("キャンセルテスト")).toBeVisible();
    await expect(page.getByText("変更したタイトル")).not.toBeVisible();
  });

  test("編集中は他のTodoの操作ができない", async ({ page }) => {
    // 2つのTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("Todo 1");
    await page.getByRole("button", { name: "追加" }).click();
    await page.waitForTimeout(500);

    await page.getByPlaceholder("タイトルを入力...").fill("Todo 2");
    await page.getByRole("button", { name: "追加" }).click();
    await page.waitForTimeout(500);

    // 最初のTodoの編集ボタンをクリック
    await page.getByRole("button", { name: "編集" }).first().click();

    // 追加フォームが無効化されていることを確認
    await expect(page.getByRole("button", { name: "追加" })).toBeDisabled();

    // 他のTodoの編集・削除ボタンが無効化されていることを確認
    const editButtons = await page.getByRole("button", { name: "編集" }).all();
    const deleteButtons = await page
      .getByRole("button", { name: "削除" })
      .all();

    for (const button of editButtons) {
      await expect(button).toBeDisabled();
    }

    for (const button of deleteButtons) {
      await expect(button).toBeDisabled();
    }

    // チェックボックスも無効化されていることを確認
    const checkboxes = await page.getByRole("checkbox").all();
    for (const checkbox of checkboxes) {
      await expect(checkbox).toBeDisabled();
    }
  });

  test("優先度と期限を設定してTodoを追加できる", async ({ page }) => {
    // Todoのタイトル入力
    await page.getByPlaceholder("タイトルを入力...").fill("優先度付きタスク");

    // 期限を入力
    await page.locator('input[type="date"]').fill("2025-12-31");

    // 優先度を選択
    await page.getByRole("combobox").selectOption("high");

    // 追加ボタンをクリック
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されたことを確認
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "優先度付きタスク" })).toBeVisible();
    await expect(page.getByText(/📅 2025\/12\/31/)).toBeVisible();
    await expect(page.locator(".todo-item").filter({ hasText: "優先度付きタスク" }).getByText("🔴 高")).toBeVisible();
  });

  test("期限順でソートできる", async ({ page }) => {
    // 3つのTodoを異なる期限で追加
    const todos = [
      { title: "ソートタスク1", date: "2025-12-31" },
      { title: "ソートタスク2", date: "2025-01-15" },
      { title: "ソートタスク3", date: "2025-06-30" },
    ];

    for (const todo of todos) {
      await page.getByPlaceholder("タイトルを入力...").fill(todo.title);
      await page.locator('input[type="date"]').fill(todo.date);
      await page.getByRole("button", { name: "追加" }).click();
      await page.waitForTimeout(500);
    }

    // 期限順でソート
    await page.getByRole("button", { name: "期限順" }).click();
    await page.waitForTimeout(500);

    // 最初の3つのソートされたTodoを確認
    const todoList = page.locator(".todo-list .todo-item");
    await expect(todoList.filter({ hasText: "ソートタスク2" }).first()).toBeVisible(); // 最も早い期限
  });

  test("優先度順でソートできる", async ({ page }) => {
    // 3つのTodoを異なる優先度で追加
    const todos = [
      { title: "優先度低", priority: "low" },
      { title: "優先度高", priority: "high" },
      { title: "優先度中", priority: "medium" },
    ];

    for (const todo of todos) {
      await page.getByPlaceholder("タイトルを入力...").fill(todo.title);
      await page.getByRole("combobox").selectOption(todo.priority);
      await page.getByRole("button", { name: "追加" }).click();
      await page.waitForTimeout(500);
    }

    // 優先度順でソート
    await page.getByRole("button", { name: "優先度順" }).click();
    await page.waitForTimeout(500);

    // 高優先度のTodoが存在し、低優先度よりも前にあることを確認
    const highPriorityTodo = page.locator(".todo-item").filter({ hasText: "優先度高" });
    await expect(highPriorityTodo).toBeVisible();
  });

  test("期限切れのTodoが赤色でハイライトされる", async ({ page }) => {
    // 過去の日付でTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("期限切れタスク");
    await page.locator('input[type="date"]').fill("2024-01-01");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByText("期限切れタスク")).toBeVisible();

    // 期限切れクラスが適用されていることを確認
    const overdueItem = page.locator(".todo-item.overdue").first();
    await expect(overdueItem).toBeVisible();
  });

  test("優先度と期限を編集できる", async ({ page }) => {
    // Todoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("編集対象タスク");
    await page.locator('input[type="date"]').fill("2025-12-01");
    await page.getByRole("combobox").selectOption("low");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "編集対象タスク" })).toBeVisible();

    // この特定のTodoの編集ボタンをクリック
    const todoItem = page.locator(".todo-item").filter({ hasText: "編集対象タスク" });
    await todoItem.getByRole("button", { name: "編集" }).click();

    // 編集フォームが表示されることを確認
    const dateInput = page.locator(".edit-form input[type='date']").first();
    const prioritySelect = page.locator(".edit-form select").first();

    // 値を編集
    await dateInput.fill("2025-12-25");
    await prioritySelect.selectOption("high");

    // 保存ボタンをクリック
    await page.getByRole("button", { name: "保存" }).click();

    // 編集内容が反映されることを確認
    await expect(todoItem.getByText(/📅 2025\/12\/25/)).toBeVisible();
    await expect(todoItem.locator(".priority").filter({ hasText: "🔴 高" })).toBeVisible();
  });
});
