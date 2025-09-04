import { Collection, Item } from "chartsy-types";

export const validateCollection = (collection: Collection): void => {
  // check structure
  expect(collection).toHaveProperty("id");
  expect(collection).toHaveProperty("collection_name");
  expect(collection).toHaveProperty("icon");
  expect (collection).toHaveProperty("created_at");
  //  check types and value constraints
  expect(Number.isInteger(collection.id)).toBe(true);
  expect(collection.id).toBeGreaterThan(0);
  expect(typeof collection.collection_name).toBe("string");
  expect(typeof collection.icon).toBe("string");
  expect(() => new Date(collection.created_at)).not.toThrow();
  // adding 1000ms to account for clock differences between DB and test environment
  expect(new Date(collection.created_at).getTime()).toBeLessThan(
    new Date().getTime() + 1000
  );
};
export const validateItem = (item: Item): void => {
  // check structure
  expect(item).toHaveProperty("id");
  expect(item).toHaveProperty("collection_id");
  expect(item).toHaveProperty("item_name");
  expect(item).toHaveProperty("icon");
  expect (item).toHaveProperty("created_at");
  //  check types and value constraints
  expect(Number.isInteger(item.id)).toBe(true);
  expect(item.id).toBeGreaterThan(0);
  expect(Number.isInteger(item.collection_id)).toBe(true);
  expect(item.collection_id).toBeGreaterThan(0);
  expect(typeof item.item_name).toBe("string");
  expect(typeof item.icon).toBe("string");
  expect(() => new Date(item.created_at)).not.toThrow();
  // adding 1000ms to account for clock differences between DB and test environment
  expect(new Date(item.created_at).getTime()).toBeLessThan(
    new Date().getTime() + 1000
  );
}

export const validateItemData = (itemData: any): void => {
  // check structure
  expect(itemData).toHaveProperty("id");
  expect(itemData).toHaveProperty("item_id");
  expect(itemData).toHaveProperty("data_type");
  expect(itemData).toHaveProperty("data_body");
  expect (itemData).toHaveProperty("created_at");
  expect (itemData).toHaveProperty("updated_at");
  //  check types and value constraints
  expect(Number.isInteger(itemData.id)).toBe(true);
  expect(itemData.id).toBeGreaterThan(0);
  expect(Number.isInteger(itemData.item_id)).toBe(true);
  expect(itemData.item_id).toBeGreaterThan(0);
  expect(typeof itemData.data_type).toBe("string");
  expect(["text", "image", "file"].includes(itemData.data_type)).toBe(true);
  expect(typeof itemData.data_body).toBe("string");
  expect(() => new Date(itemData.created_at)).not.toThrow();
  expect(() => new Date(itemData.updated_at)).not.toThrow();
  // adding 1000ms to account for clock differences between DB and test environment
  expect(new Date(itemData.created_at).getTime()).toBeLessThan(
    new Date().getTime() + 1000
  );
  expect(new Date(itemData.updated_at).getTime()).toBeLessThan(
    new Date().getTime() + 1000
  );
}
