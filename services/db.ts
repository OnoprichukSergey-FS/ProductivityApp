import * as SQLite from "expo-sqlite";
import { Task, Priority } from "../types/task";

let useMemory = false;
let dbPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;

let memoryTasks: Task[] = [];
let nextId = 1;

async function getDb() {
  if (useMemory) return null;

  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        const db = await SQLite.openDatabaseAsync("tasks.db");

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT NOT NULL,
            completed INTEGER NOT NULL,
            created_at TEXT NOT NULL
          );
        `);

        return db;
      } catch (e) {
        console.warn(
          "SQLite failed to open, using in-memory tasks instead.",
          e
        );
        useMemory = true;
        return null;
      }
    })();
  }

  return dbPromise;
}

export async function getTasks(): Promise<Task[]> {
  const db = await getDb();

  if (!db) {
    // in-memory fallback
    return [...memoryTasks].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }

  const rows = await db.getAllAsync(
    "SELECT * FROM tasks ORDER BY created_at DESC;"
  );

  return rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    priority: row.priority as Priority,
    completed: row.completed === 1,
    createdAt: row.created_at,
  }));
}

export async function addTask(
  title: string,
  description: string,
  priority: Priority
): Promise<void> {
  const createdAt = new Date().toISOString();
  const db = await getDb();

  if (!db) {
    // in-memory
    memoryTasks.unshift({
      id: nextId++,
      title,
      description,
      priority,
      completed: false,
      createdAt,
    });
    return;
  }

  await db.runAsync(
    "INSERT INTO tasks (title, description, priority, completed, created_at) VALUES (?, ?, ?, ?, ?);",
    [title, description, priority, 0, createdAt]
  );
}

export async function toggleTaskCompleted(
  id: number,
  completed: boolean
): Promise<void> {
  const db = await getDb();

  if (!db) {
    memoryTasks = memoryTasks.map((t) =>
      t.id === id ? { ...t, completed } : t
    );
    return;
  }

  await db.runAsync("UPDATE tasks SET completed = ? WHERE id = ?;", [
    completed ? 1 : 0,
    id,
  ]);
}

export async function deleteTask(id: number): Promise<void> {
  const db = await getDb();

  if (!db) {
    memoryTasks = memoryTasks.filter((t) => t.id !== id);
    return;
  }

  await db.runAsync("DELETE FROM tasks WHERE id = ?;", [id]);
}
