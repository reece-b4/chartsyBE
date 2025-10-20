import request from "supertest";
import { app } from "../src/app";
import db from "../db/connection";
import {
  validateCollection,
  validateItem,
  validateItemData,
} from "../tests/utils";
import { runSeed } from "../db/seeds/seedDBJSON";
import {
  CollectionInput,
  // Collection,
  Collections,
  ItemInput,
  // Item,
  Items,
  SingleItemDataInput,
  // SingleItemData,
  ItemDataArray,
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
  test("404 - given non existent path responds with message path not found <GLOBAL>", async () => {
    const response = await request(app).get("/api/not-a-path").expect(404);
    expect(response.body.msg).toBe("path not found");
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("Status: 200 - Returns message - get request received, 200 OK", async () => {
      const response = await request(app).get("/api").expect(200);
      expect(response.body.msg).toEqual("get request received, 200 OK");
    });
    test("status - 200 - returns an array of collections", async () => {
      const response = await request(app).get("/api/collections").expect(200);
      // Why does this not ensure what is being assigned to collections const fits the type of Collections?
      // response.body.collections is "any" so it doesn't check it further down the chain?
      // TODO: ensure types correctly - validate with zod? look into zod

      expect(response.body.collections).toBeInstanceOf(Array);
      expect(response.body.collections.length).toBeGreaterThan(0);
      // this is casting as Collections which does not ensure it suits the type - hence why created_as was passing as a string even though it (incorrectly) expects a Date
      // Supertest (and fetch, axios, etc.) give any in response.body
      for (const collection of response.body.collections as Collections) {
        validateCollection(collection);
      }
    });
    test("status - 200 - given id, returns collection with said id", async () => {
      const response = await request(app).get("/api/collection/1").expect(200);

      validateCollection(response.body.collection);
      expect(response.body.collection.id).toBe(1);
      expect(response.body.collection.collection_name).toBe("Getting Started");
    });
    test("status - 200 - returns an array of all items", async () => {
      const response = await request(app).get("/api/items").expect(200);
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBe(13);
      for (const item of response.body.items as Items) {
        validateItem(item);
      }
    });
    // get item by id
    test("status - 200 - given id, returns item with said id", async () => {
      const response = await request(app).get("/api/item/1").expect(200);
      validateItem(response.body.item);
      expect(response.body.item.id).toBe(1);
      expect(response.body.item.item_name).toBe("First item");
    });
    // get items by collection id
    test("status - 200 - given collection id, returns items with said collection id", async () => {
      const response = await request(app)
        .get("/api/items?collection_id=2")
        .expect(200);
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBe(2);
      for (const item of response.body.items as Items) {
        validateItem(item);
        expect(item.collection_id).toBe(2);
      }
    });
    // get all item_data
    test("status - 200 - returns an array of all item_data", async () => {
      const response = await request(app).get("/api/item_data").expect(200);
      expect(response.body.item_data).toBeInstanceOf(Array);
      expect(response.body.item_data.length).toBe(14);
      for (const itemData of response.body.item_data as ItemDataArray) {
        response.body.item_data.forEaK;
        validateItemData(itemData);
      }
    });

    // get item_data by id
    test("status - 200 - given id, returns item_data with said id", async () => {
      const response = await request(app).get("/api/item_data/1").expect(200);
      validateItemData(response.body.item_data);
      expect(response.body.item_data.id).toBe(1);
      expect(response.body.item_data.item_id).toBe(1);
      expect(response.body.item_data.data_body).toBe(
        "Hello from your new schema!",
      );
    });

    // get item_data_array by item id
    test("status - 200 - given item id, returns item_data array with said item id", async () => {
      const response = await request(app)
        .get("/api/item_data?item_id=2")
        .expect(200);
      expect(response.body.item_data).toBeInstanceOf(Array);
      expect(response.body.item_data.length).toBe(2);
      for (const itemData of response.body.item_data as ItemDataArray) {
        validateItemData(itemData);
        expect(itemData.item_id).toBe(2);
      }
    });
  });
});

// given invalid collection object return correct error code and message
// given no collection object return correct error code and message
// all other possible error tests

// post collection
describe("POST /api/collection", () => {
  test("status - 201 - returns the newly created collection", async () => {
    const newCollection = {
      collection_name: "Posted collection",
      icon: "📝",
    };

    const response = await request(app)
      .post("/api/collection")
      .send(newCollection)
      .expect(201);
    validateCollection(response.body.collection);
    expect(response.body.collection.collection_name).toBe(
      newCollection.collection_name,
    );
    expect(response.body.collection.icon).toBe(newCollection.icon);
    expect(response.body.collection.id).toBe(8);
  });
  // post item by collection id
  test("POST /api/item/:collection_id - status 201 - adds item with correct collection id and returns the newly created item", async () => {
    const newItem = {
      item_name: "Posted item",
      icon: "📝",
    };

    const response = await request(app)
      .post("/api/item?collection_id=1")
      .send(newItem)
      .expect(201);
    validateItem(response.body.item);
    expect(response.body.item.collection_id).toBe(1);
    expect(response.body.item.item_name).toBe(newItem.item_name);
    expect(response.body.item.icon).toBe(newItem.icon);
  });

  // post item_data by item id
  test("POST /api/item_data/:item_id - status 201 - adds item_data with correct item id and returns the newly created item_data", async () => {
    const newItemData = {
      data_type: "text",
      data_body: "Posted item data",
    };
    const response = await request(app)
      .post("/api/item_data?item_id=1")
      .send(newItemData)
      .expect(201);
    validateItemData(response.body.item_data);
    expect(response.body.item_data.item_id).toBe(1);
    expect(response.body.item_data.data_type).toBe(newItemData.data_type);
    expect(response.body.item_data.data_body).toBe(newItemData.data_body);
    expect(response.body.item_data.id).toBe(15);
  });
});

describe("patch", () => {
  // replace part of an entity - currently set up to allow patching of any combination of updatable fields using an allowlist
  // patch collection by id
  test("status: 200 - updates collection name and icon and returns updated collection", async () => {
    const updatedCollection = {
      collection_name: "Updated collection name",
      icon: "🔄",
    };
    const response = await request(app)
      .patch("/api/collection/1")
      .send(updatedCollection)
      .expect(200);
    validateCollection(response.body.collection);
    expect(response.body.collection.id).toBe(1);
    expect(response.body.collection.collection_name).toBe(
      updatedCollection.collection_name,
    );
    expect(response.body.collection.icon).toBe(updatedCollection.icon);
  });

  test("status: 200 - updates collection name and returns updated collection", async () => {
    const updatedCollection = {
      collection_name: "Updated collection name",
    };
    const response = await request(app)
      .patch("/api/collection/1")
      .send(updatedCollection)
      .expect(200);
    validateCollection(response.body.collection);
    expect(response.body.collection.id).toBe(1);
    expect(response.body.collection.collection_name).toBe(
      updatedCollection.collection_name,
    );
    expect(response.body.collection.icon).toBe("📁");
  });

  test("status: 200 - updates collection icon and returns updated collection", async () => {
    const updatedCollection = {
      icon: "🧐",
    };
    const response = await request(app)
      .patch("/api/collection/1")
      .send(updatedCollection)
      .expect(200);
    validateCollection(response.body.collection);
    expect(response.body.collection.id).toBe(1);
    expect(response.body.collection.collection_name).toBe("Getting Started");
    expect(response.body.collection.icon).toBe(updatedCollection.icon);
  });

  // patch item by id
  test("status: 200 - updates item name and icon and returns updated item", async () => {
    const updatedItem = {
      item_name: "Updated item name",
      icon: "🔄",
    };
    const response = await request(app)
      .patch("/api/item/1")
      .send(updatedItem)
      .expect(200);
    validateItem(response.body.item);
    expect(response.body.item.id).toBe(1);
    expect(response.body.item.item_name).toBe(updatedItem.item_name);
    expect(response.body.item.icon).toBe(updatedItem.icon);
    expect(response.body.item.collection_id).toBe(1);
  });

  test("status: 200 - updates item.collection_id updated item", async () => {
    const updatedItem = {
      collection_id: 2,
    };
    const response = await request(app)
      .patch("/api/item/1")
      .send(updatedItem)
      .expect(200);
    validateItem(response.body.item);
    expect(response.body.item.id).toBe(1);
    expect(response.body.item.item_name).toBe("First item");
    expect(response.body.item.icon).toBe("📝");
    expect(response.body.item.collection_id).toBe(2);
  });

  // patch item data by id
  test("status: 200 - updates item_id, item_data data_type and data_body and returns updated item_data", async () => {
    const updatedItemData = {
      item_id: 2,
      data_type: "image",
      data_body: "Updated item data body",
    };
    const response = await request(app)
      .patch("/api/item_data/1")
      .send(updatedItemData)
      .expect(200);
    validateItemData(response.body.item_data);
    expect(response.body.item_data.id).toBe(1);
    expect(response.body.item_data.item_id).toBe(updatedItemData.item_id);
    expect(response.body.item_data.data_type).toBe(updatedItemData.data_type);
    expect(response.body.item_data.data_body).toBe(updatedItemData.data_body);
  });
});

describe("delete", () => {
  // delete collection by id
  // this is still idempotent as idempotency is defined as the state of the server being the same after one request as it is after multiple identical requests not the request code itself
  test("status: 204 - deletes collection by id and returns nothing", async () => {
    const response = await request(app).delete("/api/collection/1").expect(204);
    expect(response.body).toEqual({});
    const getResponse = await request(app).get("/api/collection/1").expect(404);
    expect(getResponse.body.msg).toBe("Collection not found");
  });
  // TODO: associated items and item_data should also be deleted via cascade
  // TODO: need to test ids of deleted items/collections/item_data not reused or can we assume as is postgres behavior?

  // delete item by id
  test("status: 204 - deletes item by id and returns nothing", async () => {
    const response = await request(app).delete("/api/item/1").expect(204);
    expect(response.body).toEqual({});
    const getResponse = await request(app).get("/api/item/1").expect(404);
    expect(getResponse.body.msg).toBe("Item not found");
  });
  // delete item data by id
  test("status: 204 - deletes item_data by id and returns nothing", async () => {
    const response = await request(app).delete("/api/item_data/1").expect(204);
    expect(response.body).toEqual({});
    const getResponse = await request(app).get("/api/item_data/1").expect(404);
    expect(getResponse.body.msg).toBe("Item data not found");
  });
});

describe("PUT", () => {
  // replace whole entity
  // Will not allow creation on PUTS if id not found as is best practice however allowing creation on PUTS is more idempotent
  // should not allow change of id or created at - immutable fields
  //	200 OK — replaced an existing resource.
  // 201 Created — created a new resource.
  // 204 No Content — updated but don’t want to send a body.
  // 404 Not Found — don’t allow creating on PUT and the resource doesn’t exist.
  // 409 Conflict — state of the system prevents creating/updating (constraint).

  // put collection by id
  test("status: 200 - updates collection name and icon (all mutable fields) and returns updated collection", async () => {
    const updatedCollection = {
      collection_name: "Updated collection name with put",
      icon: "🔄",
    };
    const response = await request(app)
      .put("/api/collection/2")
      .send(updatedCollection)
      .expect(200);
    validateCollection(response.body.collection);
    expect(response.body.collection.id).toBe(2);
    expect(response.body.collection.collection_name).toBe(
      updatedCollection.collection_name,
    );
    expect(response.body.collection.icon).toBe(updatedCollection.icon);
  });
});

// TODO: ensure http codes correct
// TODO: refactor to standard practice organisation of tests here ie, group collections vs gets etc

// TODO: add in item and itemData puts for templating

// error tests

// ensure tests are idempotent especially between local and prod testing or have a different strategy? db must be a known state though to test
// rather than reseed after each test, rollback transactions?

// split tests into multiple files by route ie collections, items, item_data and refactor describe blocks as currently follow no standard pattern
// check all edge cases
// expand existing tests for more detail
// research for anything missing/modern best practices, etc

// TODO: if I refactor to genericise appropriate endpoints, does general structure needs refactoring to match?
// can updated at properties be set to postgress data type that auto-updates on any change? if not then on puts and patches updated in query the updated at column for that row
// UPDATED AT NOT HANDLED
// remove logs ------
// TODO: in updates/patches, need to check entity exists first before trying to update? otherwise return correct html code and message
// TODO: prevent attempts at updating immutable fields ie id, created at. this is done by allowlist for patches but not for puts (either handle fully in api or create a DB constraint - google a "trigger" to do this)
// TODO: ensure types across the board
// TODO: look into cors ----
// TODO: look into preflight requests ----
// TODO: should deletes be genericised?
// TODO: should get by id be within general get query?
// TODO: triple check dynamic patch sql creation is secure against sql injection, breakage from different ordering of fields etc - google best practice and thoroughly test
// TODO: can add resource be genericised? as they all follow same pattern
// TODO: add more tests for error handling and edge cases
// TODO:  // do not allow for non whitelisted fields to be present even if they are ignored in all endpoints
// TODO: what other features could be needed now or in future?
// TODO: refactor provided checks etc into reusable functions in utils
// TODO: clean up code, remove logs
//  checkout https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT there are other http request methods -----

// HTTP response status codes
// 1xx: Informational – Communicates transfer protocol-level information.
// 2xx: Success – Indicates that the client’s request was accepted successfully.
// 3xx: Redirection – Indicates that the client must take some additional action in order to complete their request.
// 4xx: Client Error – This category of error status codes points the finger at clients.
// 5xx: Server Error – The server takes responsibility for these error status codes.
