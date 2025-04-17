import express from "express";
const app = express();

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

app.get("/", (_req, res) => {
  res.send("get request received, 200 OK");
});

// create a task with following properties: title, description (optional), status, due date/time
// get all tasks - home page
// get task by id - expanded from home page
// update status of a task by id button on tasks card and expanded task card
// delete task by id button on task card and expanded task crd

// db needed
// unit tests needed
// validation and error handling

// design front end
// create db with dummy/seeded data
// create tests for single endpoints
// create end points
// handle validation and error handling

// move to front end
// extra features, accessibility, responsiveness
// scripts to handle everything easily for tester
// README/documentation
