import { Task, Priority } from "../types/task";

let memoryTasks: Task[] = [];
let nextId = 1;

export async function initDB(): Promise<void> {
  return;
}

export async function getTasks(): Promise<Task[]> {
  return memoryTasks
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addTask(
  title: string,
  description: string,
  priority: Priority
): Promise<void> {
  const createdAt = new Date().toISOString();

  memoryTasks.push({
    id: nextId++,
    title,
    description,
    priority,
    completed: false,
    createdAt,
  });
}

export async function toggleTaskCompleted(
  id: number,
  completed: boolean
): Promise<void> {
  memoryTasks = memoryTasks.map((t) => (t.id === id ? { ...t, completed } : t));
}

export async function deleteTask(id: number): Promise<void> {
  memoryTasks = memoryTasks.filter((t) => t.id !== id);
}
