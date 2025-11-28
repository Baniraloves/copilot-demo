from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

app = FastAPI(title="Todo API", version="1.0.0")

# CORS設定 - フロントエンドからのアクセスを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Viteのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Todoデータモデル
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[date] = None
    priority: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None

class Todo(TodoBase):
    id: int
    created_at: datetime

# メモリ内データストア（デモ用）
todos_db: List[Todo] = []
todo_id_counter = 1

@app.get("/")
def read_root():
    return {"message": "Todo API - GitHub Copilot Demo"}

@app.get("/api/todos", response_model=List[Todo])
def get_todos():
    """全てのTodoを取得"""
    return todos_db

@app.get("/api/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    """特定のTodoを取得"""
    for todo in todos_db:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.post("/api/todos", response_model=Todo, status_code=201)
def create_todo(todo: TodoCreate):
    """新しいTodoを作成"""
    global todo_id_counter
    new_todo = Todo(
        id=todo_id_counter,
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
        due_date=todo.due_date,
        priority=todo.priority,
        created_at=datetime.now()
    )
    todos_db.append(new_todo)
    todo_id_counter += 1
    return new_todo

@app.put("/api/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_update: TodoUpdate):
    """Todoを更新"""
    for index, todo in enumerate(todos_db):
        if todo.id == todo_id:
            updated_data = todo_update.model_dump(exclude_unset=True)
            updated_todo = todo.model_copy(update=updated_data)
            todos_db[index] = updated_todo
            return updated_todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    """Todoを削除"""
    global todos_db
    for index, todo in enumerate(todos_db):
        if todo.id == todo_id:
            todos_db.pop(index)
            return
    raise HTTPException(status_code=404, detail="Todo not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
