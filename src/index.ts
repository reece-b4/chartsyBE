import express from "express";
import db from "../db/connection";

const app = express();
app.use(express.json()); 
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

app.get("/", (_req, res) => {
  res.send("get request received, 200 OK");
});

app.post("/api/task",async (req, res) => {
  const { title, description, status, due, priority, tags } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tasks (title, description, status, due, priority, tags) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [title, description, status, due, priority, tags]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to insert task:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
})