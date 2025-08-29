-- Link items to collections
ALTER TABLE items
  ADD CONSTRAINT items_collection_fk
  FOREIGN KEY (collection_id)
  REFERENCES collections(id)
  ON DELETE CASCADE;

-- Link item_data to items
ALTER TABLE item_data
  ADD CONSTRAINT item_data_item_fk
  FOREIGN KEY (item_id)
  REFERENCES items(id)
  ON DELETE CASCADE;

  -- Ensure unique names

-- 1) Each collection name must be globally unique
ALTER TABLE collections
  ADD CONSTRAINT collections_name_unique
  UNIQUE (collection_name);

-- 2) Each item name must be unique within its collection
ALTER TABLE items
  ADD CONSTRAINT items_collection_name_unique
  UNIQUE (collection_id, item_name);