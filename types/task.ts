export type Priority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  createdAt: string;
};
