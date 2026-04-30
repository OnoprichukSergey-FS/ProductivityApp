import { Task, Priority } from "../types/task";

const STORAGE_KEY = "productivity_tasks";

function load(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function getTasks(): Promise<Task[]> {
  return load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addTask(
  title: string,
  description: string,
  priority: Priority,
  dueDate: string
): Promise<void> {
  const tasks = load();

  const newTask: Task = {
    id: Date.now(),
    title,
    description,
    priority,
    completed: false,
    dueDate,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  save(tasks);
}

export async function toggleTaskCompleted(
  id: number,
  completed: boolean
): Promise<void> {
  const tasks = load().map((t) => (t.id === id ? { ...t, completed } : t));
  save(tasks);
}

export async function deleteTask(id: number): Promise<void> {
  const tasks = load().filter((t) => t.id !== id);
  save(tasks);
}
