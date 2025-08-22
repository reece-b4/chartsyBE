import express from "express";
import cors from "cors";
import { notAPath } from "@/errorhandling/index";
import { customErrors, sqlErrors, serverErrors } from "@/errorhandling/index";
import { getAllTasks, getTaskById, postTask } from "@/controllers/tasks.controller";

const allowlist = [
  'http://localhost:5173',
  'https://dck7gx4ukouvd.cloudfront.net',
];

export const app = express();
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);             // allow curl/Postman
    cb(null, allowlist.includes(origin));
  },
  credentials: true,
}));
// Ensure preflight works for every route
app.options('*', cors());
app.use(express.json());

// src/app.ts (near other routes)
app.get("/api", (_req, res) => {
  res.status(200).json({ msg: "get request received, 200 OK test4" });
});

app.get("/api/task/:id", getTaskById);
app.get("/api/tasks", getAllTasks);
app.post("/api/task", postTask);

// must be after routes as middleware executes in defined order
app.all("/api/*", notAPath);
app.use(customErrors);
app.use(sqlErrors);
app.use(serverErrors);

// cors error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const origin = allowlist.includes(req.headers.origin as string)
    ? req.headers.origin
    : '';
  res.set('Access-Control-Allow-Origin', origin);
  res.set('Access-Control-Allow-Credentials', 'true');
  res.status(err.status || 500).json({ error: err.message || 'Internal' });
});
