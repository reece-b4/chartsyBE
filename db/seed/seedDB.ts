import axios from "axios";
import tasks from "../data/tasks.json"
import db from "../connection";

const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error("Missing BASE_URL environment variable");
}

const api = axios.create({ baseURL });

const runSeed = async ( tasks: any ) => {
  db.query(`TRUNCATE TABLE tasks CASCADE;`)
  await postTasks(tasks.tasks);
};

const postTasks = async (tasks: any) => {
   tasks.forEach(async (task: any) => {
   await api.post("/api/task", task);
  })
}

runSeed(tasks);