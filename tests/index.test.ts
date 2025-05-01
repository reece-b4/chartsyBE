import request from "supertest";
import { app } from "../src/app";
import db from "../db/connection";
import { Task } from "../src/interfaces";
import { validateTask } from "../tests/utils";

// keep in mind to reset DB data when needed

// http tests

afterAll(() => {
  return db.end();
});

describe("GET /api/not-a-valid-path", () => {
  test("404 - given non existent path responds with message path not found <GLOBAL>", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("Status: 200 - Returns message - get request received, 200 OK", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toEqual("get request received, 200 OK");
        });
    });
  });
  test("status - 200 - returns an array of tasks", () => {
    return request(app)
      .get("/api/tasks")
      .expect(200)
      .then((response) => {
        expect(response.body.tasks).toBeInstanceOf(Array);
        expect(response.body.tasks.length).toBeGreaterThan(0);
        response.body.tasks.forEach((task: Task) => {
          expect(validateTask(task))
        });
      });
  });
});

describe("POST /api/task", () => {
  test("status - 201 - returns the newly created task", () => {
    const newTask = {
      title: "Test Task",
      description: "This is a test task",
      status: "in_progress",
      due: new Date(Date.now() + 86400000).toISOString(),
      priority: "medium",
      tags: ["pensions"],
    };

    return request(app)
      .post("/api/task")
      .send(newTask)
      .expect(201)
      .then((response) => {
        expect(validateTask(response.body.task))
      });
  });
});
