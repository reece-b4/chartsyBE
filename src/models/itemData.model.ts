import db from "../../db/connection";
import { SingleItemData } from "chartsy-types";

export const fetchItemData = async (itemId: number | null) => {
  let query: string;
  if (itemId) {
    query = "SELECT * FROM item_data WHERE item_id = $1;";
  } else {
    query = "SELECT * FROM item_data;";
  }
  const result = await db.query(query, itemId ? [itemId] : []);
  const item_data = result.rows.map((data: SingleItemData) => data);
  return item_data;
};

export const fetchItemDataById = async (Id: number) => {
  const result = await db.query("SELECT * FROM item_data WHERE id = $1;", [
    Id,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const item_data = result.rows[0];
  return item_data;
};

export const addItemDataByItemId = async (
  itemData: SingleItemData,
  itemId: string,
) => {
  const { data_type, data_body } = itemData;
  const result = await db.query(
    `INSERT INTO item_data (item_id, data_type, data_body) 
           VALUES ($1, $2, $3) RETURNING *;`,
    [itemId, data_type, data_body],
  );
  return result.rows[0];
};

export const updateItemDataById = async (
  id: string,
  propertyNames: any[],
  propertyValues: any[],
) => {
  console.log('propertyNames:', propertyNames);
  const setClauses = propertyNames.map((prop, i) => `${prop} = $${i + 2}`);
  const query = `UPDATE item_data 
       SET ${setClauses.join(", ")}
       WHERE id = $1
       RETURNING *;`;
       const values = [id, ...propertyValues];
       console.log("Update query:", query,"values:", values);

  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

export const removeItemDataById = async (id: string) => {
  const result = await db.query(
    "DELETE FROM item_data WHERE id = $1 RETURNING *;",
    [id],
  );
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};