import express from "express";
import db from "../db/connection";
import { notAPath } from "@/errorhandling/index";

export const app = express();
app.use(express.json());

app.get("/api", (_req, res) => {
  res.status(200).json({ msg: "get request received, 200 OK" });
});

// TODO: add next error handling middleware
// then add other endpoints
// then refactor to use model controller pattern
app.get("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1;", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({task: result.rows[0]});
  } 
  catch (error) {
    console.error("Failed to fetch task:", error);
    res.status(500).json({ msg: "Something went wrong - could not get task" });
  }
});

app.get("/api/tasks", async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks;");
    const tasks = result.rows.map((task) => ({
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
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ msg: "Something went wrong - could not get tasks" });
  }
});

app.post("/api/task", async (req, res) => {
  const { title, description, status, due, priority, tags } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tasks (title, description, status, due, priority, tags) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [title, description, status, due, priority, tags]
    );

    res.status(201).json({task: result.rows[0]});
  } catch (error) {
    console.error("Failed to insert task:", error);
    res.status(500).json({ msg: "Something went wrong - could not post task" });
  }
});

app.all("/api/*", notAPath);
