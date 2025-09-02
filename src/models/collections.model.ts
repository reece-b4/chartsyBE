import db from "../../db/connection";
import { Collection } from "chartsy-types";

export const fetchAllCollections = async () => {
  const result = await db.query("SELECT * FROM collections;");
  const collections = result.rows.map((collection: Collection) => ({
    id: collection.id,
    collection_name: collection.collection_name,
    icon: collection.icon,
    // status: collection.status,
    // due: collection.due,
    // priority: collection.priority,
    // tags: collection.tags,
    created_at: collection.created_at,
    // updated_at: collection.updated_at,
  }));
  return collections;
};

export const fetchCollectionById = async (id: string) => {
  const result = await db.query("SELECT * FROM collections WHERE id = $1;", [id]);
  if (result.rows.length === 0) {
    return null;
  }
  const collection = result.rows[0];
  return collection;
};

export const addCollection = async (collection: Collection) => {
  const { collection_name, icon } = collection;
  const result = await db.query(
    `INSERT INTO collections (collection_name, icon) 
         VALUES ($1, $2) RETURNING *;`,
    [collection_name, icon]
  );
  return result.rows[0];
};
