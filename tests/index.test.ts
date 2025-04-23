import request from "supertest";
import { app } from "../src/app";
import db from "../db/connection";

// keep in mind to reset DB data when needed

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
});
