import request from "supertest";
import { app } from "../src/app";
import db from "../db/connection";
// import { validateTask } from "../tests/utils";
import { runSeed } from "../db/seeds/seedDBJSON";
import { CollectionInput, Collection,
  //  Collections, 
   ItemInput, 
  //  Item, 
  //  Items, 
   SingleItemDataInput, 
  //  SingleItemData, 
  //  ItemDataArray, 
  //  ItemDataType  
  } from "chartsy-types";
import collectionsJSON from "../db/seeds/data/collections.json";
import itemsJSON from "../db/seeds/data/items.json";
import itemDataJSON from "../db/seeds/data/item_data.json";

const collections = collectionsJSON as CollectionInput[];
const items = itemsJSON as ItemInput[];
const itemData = itemDataJSON as SingleItemDataInput[];

afterEach(async () => {
  if (process.env.NODE_ENV !== "neon:ephemeral") {
    return await runSeed(collections, items, itemData);
  }
});

afterAll(async () => {
  console.log("Closing database connection");
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
  // get collections
  // get items by collection id
  // get item data by item id
  test("status - 200 - returns an array of collections", () => {
    return request(app)
      .get("/api/collections")
      .expect(200)
      .then((response) => {
        expect(response.body.collections).toBeInstanceOf(Array);
        expect(response.body.collections.length).toBeGreaterThan(0);
        response.body.collections.forEach((collection: Collection) => {
          expect(collection).toHaveProperty("id");
          expect(collection).toHaveProperty("collection_name");
          expect(collection).toHaveProperty("icon");
          expect(collection).toHaveProperty("created_at");
          // expect(collection).toHaveProperty("updated_at");
        });
      });
  });
});
// post collection
// post item by collection id
// post item data by item id
describe("POST /api/task", () => {
  test.skip("status - 201 - returns the newly created task", () => {
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
        console.log("response.body", response.body);
        // expect(validateTask(response.body.task));
      });
  });
});
// patch collection by id
// patch item by id
// patch item data by id

// delete collection by id
// delete item by id
// delete item data by id
