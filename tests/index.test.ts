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
  Collection,
  //  Collections,
  ItemInput,
  Item,
  //  Items,
  SingleItemDataInput,
  SingleItemData,
  //  ItemDataArray,
  //  ItemDataType
} from "chartsy-types";
import collectionsJSON from "../db/seeds/data/collections.json";
import itemsJSON from "../db/seeds/data/items.json";
import itemDataJSON from "../db/seeds/data/item_data.json";

// TODO: ensure http codes correct
// TODO: refactor to standard practice organisation of tests here ie, group collections vs gets etc
// TODO: PUt VS PATCH
// TODO: should ids be sent by params or body?

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
    test("status - 200 - returns an array of collections", () => {
      return request(app)
        .get("/api/collections")
        .expect(200)
        .then((response) => {
          expect(response.body.collections).toBeInstanceOf(Array);
          expect(response.body.collections.length).toBeGreaterThan(0);
          response.body.collections.forEach((collection: Collection) => {
            validateCollection(collection);
          });
        });
    });
    test("status - 200 - given id, returns collection with said id", () => {
      return request(app)
        .get("/api/collection/1")
        .expect(200)
        .then((response) => {
          validateCollection(response.body.collection);
          expect(response.body.collection.id).toBe(1);
          expect(response.body.collection.collection_name).toBe(
            "Getting Started",
          );
        });
    });
  });
  test("status - 200 - returns an array of all items", () => {
    return request(app)
      .get("/api/items")
      .expect(200)
      .then((response) => {
        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBe(13);
        response.body.items.forEach((item: Item) => {
          validateItem(item);
        });
      });
  });
  // get item by id
  test("status - 200 - given id, returns item with said id", () => {
    return request(app)
      .get("/api/item/1")
      .expect(200)
      .then((response) => {
        validateItem(response.body.item);
        expect(response.body.item.id).toBe(1);
        expect(response.body.item.item_name).toBe("First item");
      });
  });
  // get items by collection id
  test("status - 200 - given collection id, returns items with said collection id", () => {
    return request(app)
      .get("/api/items?collection_id=2")
      .expect(200)
      .then((response) => {
        expect(response.body.items).toBeInstanceOf(Array);
        expect(response.body.items.length).toBe(2);
        response.body.items.forEach((item: Item) => {
          validateItem(item);
          expect(item.collection_id).toBe(2);
        });
      });
  });
  // get all item_data
  test("status - 200 - returns an array of all item_data", () => {
    return request(app)
      .get("/api/item_data")
      .expect(200)
      .then((response) => {
        expect(response.body.item_data).toBeInstanceOf(Array);
        expect(response.body.item_data.length).toBe(14);
        response.body.item_data.forEach((itemData: SingleItemData) => {
          validateItemData(itemData);
        });
      });
  });

  // get item_data by id
  test("status - 200 - given id, returns item_data with said id", () => {
    return request(app)
      .get("/api/item_data/1")
      .expect(200)
      .then((response) => {
        validateItemData(response.body.item_data);
        expect(response.body.item_data.id).toBe(1);
        expect(response.body.item_data.item_id).toBe(1);
        expect(response.body.item_data.data_body).toBe(
          "Hello from your new schema!",
        );
      });
  });

  // get item_data_array by item id
  test("status - 200 - given item id, returns item_data array with said item id", () => {
    return request(app)
      .get("/api/item_data?item_id=2")
      .expect(200)
      .then((response) => {
        expect(response.body.item_data).toBeInstanceOf(Array);
        expect(response.body.item_data.length).toBe(2);
        response.body.item_data.forEach((itemData: SingleItemData) => {
          validateItemData(itemData);
          expect(itemData.item_id).toBe(2);
        });
      });
  });
});

// given invalid collection object return correct error code and message
// given no collection object return correct error code and message
// all other possible error tests
// post item_data by item id
// remove console logs!!

// post collection
describe("POST /api/collection", () => {
  test("status - 201 - returns the newly created collection", () => {
    const newCollection = {
      collection_name: "Posted collection",
      icon: "📝",
    };

    return request(app)
      .post("/api/collection")
      .send(newCollection)
      .expect(201)
      .then((response) => {
        validateCollection(response.body.collection);
        expect(response.body.collection.collection_name).toBe(
          newCollection.collection_name,
        );
        expect(response.body.collection.icon).toBe(newCollection.icon);
        expect(response.body.collection.id).toBe(8);
      });
  });
  // post item by collection id
  test("POST /api/item/:collection_id - status 201 - adds item with correct collection id and returns the newly created item", () => {
    const newItem = {
      item_name: "Posted item",
      icon: "📝",
    };

    return request(app)
      .post("/api/item?collection_id=1")
      .send(newItem)
      .expect(201)
      .then((response) => {
        validateItem(response.body.item);
        expect(response.body.item.collection_id).toBe(1);
        expect(response.body.item.item_name).toBe(newItem.item_name);
        expect(response.body.item.icon).toBe(newItem.icon);
      });
  });

  // post item_data by item id
  test("POST /api/item_data/:item_id - status 201 - adds item_data with correct item id and returns the newly created item_data", () => {
    const newItemData = {
      data_type: "text",
      data_body: "Posted item data",
    };
    return request(app)
      .post("/api/item_data?item_id=1")
      .send(newItemData)
      .expect(201)
      .then((response) => {
        validateItemData(response.body.item_data);
        expect(response.body.item_data.item_id).toBe(1);
        expect(response.body.item_data.data_type).toBe(newItemData.data_type);
        expect(response.body.item_data.data_body).toBe(newItemData.data_body);
        expect(response.body.item_data.id).toBe(15);
      });
  });
});
// patch collection by id
// patch item by id
// patch item data by id

// delete collection by id
// delete item by id
// delete item data by id
