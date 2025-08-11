import request from "supertest";
import { app } from "../src/app";
import db from "../db/connection";
import { Task } from "../src/types";
import { validateTask } from "../tests/utils";
import { runSeed } from "../db/seed/seedDB";
import { TaskInput } from "@/types";
import tasks from "../db/data/tasks.json";

const tasksJson = tasks.tasks as TaskInput[];
afterEach(async () => {
  // code: 'ECONNREFUSED',
          // syscall: 'connect',
          // address: '::1',
          // port: 5432
          // trying to connect to postgres on port 5432 when we want to connect to neon ephemeral db branch

  // THIS IS LOCAL TESTING ONLY!!!!!
  
  // HERE!!!!!!!!!   NEW ERROR: Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string

  
  // DB IS NOT BEING SEEDED AFTER EACH. we dont want it to anyway during db clone testing but we dont want this to run so put in a conditional ie, node env being !=neon
  // TESTS ARE STILL FAILING!!!
  return await runSeed(tasksJson);
});

afterAll(async () => {
  console.log("Closing database connection");
  // JEST IS HANGING AT THE END OF NEON TESTS
  return db.end();
});

describe("GET /api/not-a-valid-path", () => {
  test("404 - given non existent path responds with message path not found <GLOBAL>", () => {
    // IS THIS A LOCAL API BEING RAN? I THINK SO
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
          expect(validateTask(task));
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
        expect(validateTask(response.body.task));
      });
  });
});
