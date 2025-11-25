import { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

const API_URL = "http://localhost:8000/api/todos";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Todoリストを取得
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  // 初回ロード時にTodoを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  // Todoを追加
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription || null,
          completed: false,
        }),
      });

      if (response.ok) {
        setNewTodoTitle("");
        setNewTodoDescription("");
        await fetchTodos();
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Todoの完了状態を切り替え
  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  // Todoを削除
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok || response.status === 204) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Todoの編集を開始
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  // Todoの編集を保存
  const saveEdit = async () => {
    if (!editTitle.trim() || editingId === null) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription || null,
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        await fetchTodos();
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Todoの編集をキャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <div className="app">
      <h1>📝 Todo App</h1>
      <p className="subtitle">GitHub Copilot Demo</p>

      <form onSubmit={addTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="タイトルを入力..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="input-title"
            disabled={loading || editingId !== null}
          />
          <input
            type="text"
            placeholder="説明 (オプション)"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            className="input-description"
            disabled={loading || editingId !== null}
          />
        </div>
        <button type="submit" disabled={loading || !newTodoTitle.trim() || editingId !== null}>
          {loading ? "追加中..." : "追加"}
        </button>
      </form>

      <div className="todos-container">
        {todos.length === 0 ? (
          <p className="empty-message">
            Todoがありません。上のフォームから追加してください。
          </p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""} ${editingId === todo.id ? "editing" : ""}`}
              >
                {editingId === todo.id ? (
                  <div className="edit-form">
                    <div className="edit-inputs">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-title"
                        placeholder="タイトルを入力..."
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="input-description"
                        placeholder="説明 (オプション)"
                      />
                    </div>
                    <div className="edit-actions">
                      <button
                        onClick={saveEdit}
                        className="save-btn"
                        disabled={!editTitle.trim() || loading}
                      >
                        {loading ? "保存中..." : "保存"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="cancel-btn"
                        disabled={loading}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo)}
                        className="todo-checkbox"
                        disabled={editingId !== null}
                      />
                      <div className="todo-text">
                        <h3>{todo.title}</h3>
                        {todo.description && (
                          <p className="todo-description">{todo.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button
                        onClick={() => startEdit(todo)}
                        className="edit-btn"
                        aria-label="編集"
                        disabled={editingId !== null}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-btn"
                        aria-label="削除"
                        disabled={editingId !== null}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="stats">
        <p>
          合計: {todos.length} 件 | 完了:{" "}
          {todos.filter((t) => t.completed).length} 件 | 未完了:{" "}
          {todos.filter((t) => !t.completed).length} 件
        </p>
      </footer>
    </div>
  );
}

export default App;
