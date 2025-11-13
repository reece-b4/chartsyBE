import db from "../../db/connection";
import { 
    ItemInput,
    Item } from "chartsy-types";

export const fetchItems = async (collectionId: number | null) => {
    let query: string;
    if (collectionId) {
        query = "SELECT * FROM items WHERE collection_id = $1 ORDER BY id;";
    } else {
        query = "SELECT * FROM items ORDER BY id;";
    }
  const result = await db.query(query, collectionId ? [collectionId] : []);
  const items = result.rows.map((item: Item) => item);
  return items;
};

export const fetchItemById = async (id: string) => {
    const result = await db.query("SELECT * FROM items WHERE id = $1;", [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const item = result.rows[0];
    return item;
}

export const addItemByCollectionId = async (item: ItemInput, collectionId: string) => {
    const { item_name, icon } = item;
    const result = await db.query(
      `INSERT INTO items (collection_id, item_name, icon) 
           VALUES ($1, $2, $3) RETURNING *;`,
      [collectionId, item_name, icon]
    );
    return result.rows[0];
  }

export const updateItemById = async (id: string, propertyNames: any[],propertyValues: any[]) => {

  const setClauses = propertyNames.map((prop, i) => `${prop} = $${i + 2}`);
  const query =
    `UPDATE items 
     SET ${setClauses.join(", ")}
     WHERE id = $1
     RETURNING *;`

    const values = [id, ...propertyValues]

    const result = await db.query(query, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export const removeItemById = async (id: string) => {
  const result = await db.query(
    "DELETE FROM items WHERE id = $1 RETURNING *;",
    [id]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

// TODO: get items by collection id
// TODO: get item_data by own id