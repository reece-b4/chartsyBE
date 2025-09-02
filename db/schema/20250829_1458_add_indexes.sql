-- TODO: check if this is correct - why is collections_id not indexed? Why the foreign keys of these 2 tables and not the primary keys of the tables they reference?

-- Speed up finding all items in a collection
CREATE INDEX IF NOT EXISTS idx_items_collection_id
  ON items(collection_id);

-- Speed up finding all data entries for an item
CREATE INDEX IF NOT EXISTS idx_item_data_item_id
  ON item_data(item_id);