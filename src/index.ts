import express from "express";
const app = express();

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

app.get("/", (_req, res) => {
  res.send("get request received, 200 OK");
});
