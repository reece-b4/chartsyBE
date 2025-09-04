import db from "../../db/connection";
import { 
    ItemInput,
    Item } from "chartsy-types";

export const fetchItems = async (collectionId: number | null) => {
    let query: string;
    if (collectionId) {
        query = "SELECT * FROM items WHERE collection_id = $1;";
    } else {
        query = "SELECT * FROM items;";
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