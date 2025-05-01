import db from "../../db/connection";
import { Task } from "@/interfaces";

export const fetchAllTasks = async () => {
  const result = await db.query("SELECT * FROM tasks;");
  const tasks = result.rows.map((task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    due: task.due,
    priority: task.priority,
    tags: task.tags,
    created_at: task.created_at,
    updated_at: task.updated_at,
  }));
  return tasks;
};

export const fetchTaskById = async (id: string) => {
  const result = await db.query("SELECT * FROM tasks WHERE id = $1;", [id]);
  if (result.rows.length === 0) {
    return null;
  }
  const task = result.rows[0];
  return task;
};

export const addTask = async (task: Task) => {
    const { title, description, status, due, priority, tags } = task;
    const result = await db.query(
        `INSERT INTO tasks (title, description, status, due, priority, tags) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [title, description, status, due, priority, tags]
      );
      return result.rows[0];
}
