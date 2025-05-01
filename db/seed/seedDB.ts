// import axios from "axios";
import tasks from "../data/tasks.json";
import db from "../connection";
import { TaskInput } from "@/interfaces";
import { isValidISODateString } from "../utils/index";
const tasksJson = tasks.tasks as TaskInput[];
const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error("Missing BASE_URL environment variable");
}

// const api = axios.create({ baseURL });

export const runSeed = async (tasks: TaskInput[]) => {
  await db.query(`TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;`);
  await postTasks(tasks);
};

const postTasks = async (tasks: TaskInput[]) => {
  for (const task of tasks) {
    try {
      if (!isValidISODateString(task.due, false)) {
        console.error(`Invalid date format for task: ${task.description}`);
        continue;
      }
      await db.query(
        `INSERT INTO tasks (title, description, status, due, priority, tags)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [task.title, task.description, task.status, task.due, task.priority, task.tags]
      );
      // await api.post("/api/task", task);
    } catch (err: any) {
      console.error("Error seeding task. Reason:", err.code);
    }
  }
};

if (process.env.NODE_ENV !== "test") {
  (async () => {
    console.time("Seeding tasks");
    await runSeed(tasksJson);
    await db.end();
    console.timeEnd("Seeding tasks");
  })();
}
