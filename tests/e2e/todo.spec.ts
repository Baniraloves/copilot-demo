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
    await expect(page.getByText("完了テスト")).toBeVisible();

    // チェックボックスをクリック
    const checkbox = page.getByRole("checkbox").first();
    await checkbox.check();

    // チェックボックスがチェックされたことを確認
    await expect(checkbox).toBeChecked();
  });

  test("Todoを削除できる", async ({ page }) => {
    // まずTodoを追加
    await page.getByPlaceholder("タイトルを入力...").fill("削除テスト");
    await page.getByRole("button", { name: "追加" }).click();

    // Todoが追加されるのを待つ
    await expect(page.getByText("削除テスト")).toBeVisible();

    // 削除ボタンをクリック
    await page.getByRole("button", { name: "削除" }).first().click();

    // Todoが削除されたことを確認
    await expect(page.getByText("削除テスト")).not.toBeVisible();
  });

  test("複数のTodoを追加して統計が正しく表示される", async ({ page }) => {
    // 3つのTodoを追加
    const todos = [
      { title: "Todo 1", description: "最初のTodo" },
      { title: "Todo 2", description: "2番目のTodo" },
      { title: "Todo 3", description: "3番目のTodo" },
    ];

    for (const todo of todos) {
      await page.getByPlaceholder("タイトルを入力...").fill(todo.title);
      await page.getByPlaceholder("説明 (オプション)").fill(todo.description);
      await page.getByRole("button", { name: "追加" }).click();
      await page.waitForTimeout(500); // API呼び出しを待つ
    }

    // 統計の確認
    await expect(page.getByText(/合計: 3 件/)).toBeVisible();
    await expect(page.getByText(/未完了: 3 件/)).toBeVisible();

    // 1つを完了にする
    await page.getByRole("checkbox").first().check();
    await page.waitForTimeout(500);

    // 統計が更新されることを確認
    await expect(page.getByText(/完了: 1 件/)).toBeVisible();
    await expect(page.getByText(/未完了: 2 件/)).toBeVisible();
  });

  test("空のタイトルではTodoを追加できない", async ({ page }) => {
    // 追加ボタンが無効化されていることを確認
    const addButton = page.getByRole("button", { name: "追加" });
    await expect(addButton).toBeDisabled();

    // スペースのみの入力でも無効
    await page.getByPlaceholder("タイトルを入力...").fill("   ");
    await expect(addButton).toBeDisabled();
  });
});
