export interface TaskInput {
  title: string;
  description: string | null;
  status: TaskStatus;
  due: string;
  priority: TaskPriority;
  tags: Tag[];
}

export interface Task extends TaskInput {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export type Tag = "pensions" | "benefits" | "documentation";
export type TaskStatus = "in_progress" | "complete" | "pending";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface AppError extends Error {
  status?: number;
  code?: string;
  msg?: string;
}