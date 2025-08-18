import tasks from "../data/tasks.json";
import db from "../connection";
import { TaskInput } from "@/types";
import { isValidISODateString } from "../utils/index";
const tasksJson = tasks.tasks as TaskInput[];

export const runSeed = async (tasks: TaskInput[]) => {
  console.log("Seeding tasks...");
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
        [
          task.title,
          task.description,
          task.status,
          task.due,
          task.priority,
          task.tags,
        ]
      );
    } catch (err: any) {
      console.error("Error seeding task. Reason:", err);
    }
  }
};
console.log('processing.env.NODE_ENV', process.env.NODE_ENV);
// We do not want to end db in test environment
// we do not want to seed in neon ephemeral branch tests
if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "neon:ephemeral") {
  (async () => {
    console.time("Seeding tasks");
    await runSeed(tasksJson);
    await db.end();
    console.timeEnd("Seeding tasks");
  })();
}
