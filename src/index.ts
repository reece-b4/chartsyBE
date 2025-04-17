"use strict";
const express = require("express");
const app = express();

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
// TODO: allow inferred types
app.get("/", (req, res) => {
  res.send("get request received, 200 OK");
});
