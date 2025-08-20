import express from "express";
import cors from "cors";
import { notAPath } from "@/errorhandling/index";
import { customErrors, sqlErrors, serverErrors } from "@/errorhandling/index";
import { getAllTasks, getTaskById, postTask } from "@/controllers/tasks.controller";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (_req, res) => {
  res.status(200).json({ msg: "get request received, 200 OK test" });
});

app.get("/api/task/:id", getTaskById);
app.get("/api/tasks", getAllTasks);
app.post("/api/task", postTask);

// must be after routes as middleware executes in defined order
app.all("/api/*", notAPath);
app.use(customErrors);
app.use(sqlErrors);
app.use(serverErrors);
