import collectionsJSON from "./data/collections.json";
import itemsJSON from "./data/items.json";
import itemDataJSON from "./data/item_data.json";
import db from "../connection";
import { CollectionInput, ItemInput, SingleItemDataInput, ItemDataType } from "chartsy-types";
const collections = collectionsJSON as CollectionInput[];
const items = itemsJSON as ItemInput[];
const itemData = itemDataJSON as SingleItemDataInput[];

export const runSeed = async (collections: CollectionInput[], items: ItemInput[], itemData: SingleItemDataInput[]) => {
  console.log("Seeding...");
  await db.query(`TRUNCATE TABLE collections RESTART IDENTITY CASCADE;`);
  await db.query(`TRUNCATE TABLE items RESTART IDENTITY CASCADE;`);
  await db.query(`TRUNCATE TABLE item_data RESTART IDENTITY CASCADE;`);
  await insertCollections(collections);
  await insertItems(items);
  await insertItemData(itemData);
  console.log("Seeding complete.");
};

const insertCollections = async (collections: CollectionInput[]) => {
  for (const collection of collections) {
    try {
      await db.query(
        `INSERT INTO collections (collection_name, icon)
         VALUES ($1, $2);`,
        [collection.collection_name, collection.icon]
      );
    } catch (err: any) {
      console.error("Error seeding collection. Reason:", err);
    }
  }
};

const insertItems = async (items: ItemInput[]) => {
  for (const item of items) {
    try {
      await db.query(
        `INSERT INTO items (collection_id, item_name, icon)
         VALUES ($1, $2, $3);`,
        [item.collection_id, item.item_name, item.icon]
      );
    } catch (err: any) {
      console.error("Error seeding item. Reason:", err);
    }
  }
};

const insertItemData = async (itemData: SingleItemDataInput[]) => {
  for (const data of itemData) {
    try {
      if (!["text", "image", "file"].includes(data.data_type)) {
        console.error(`Invalid data_type for item data: ${data.data_type}`);
        continue;
      }
      await db.query(
        `INSERT INTO item_data (item_id, data_type, data_body)
         VALUES ($1, $2, $3);`,
        [data.item_id, data.data_type as ItemDataType, data.data_body]
      );
    } catch (err: any) {
      console.error("Error seeding item data. Reason:", err);
    }
  }
};

// We do not want to end db in test environment
// we do not want to seed in neon ephemeral branch tests
if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "neon:ephemeral") {
  (async () => {
    console.time("Seeding");
    await runSeed(collections, items, itemData);
    await db.end();
    console.timeEnd("Seeding");
  })();
}
