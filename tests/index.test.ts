import request from "supertest";
import { app } from "../src/app";
import db from "../db/connection";

// keep in mind to reset DB data when needed

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    test("Status: 200 - Returns message - get request received, 200 OK", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            "get request received, 200 OK",
          );
        });
    });
  });
});
