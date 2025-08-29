-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_name TEXT NOT NULL,
  icon            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Items table (belongs to a collection)
CREATE TABLE IF NOT EXISTS items (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_id   BIGINT NOT NULL,
  item_name       TEXT NOT NULL,
  icon            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Item Data table (data entries for an item)
CREATE TABLE IF NOT EXISTS item_data (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_id         BIGINT NOT NULL,
  data_type       TEXT NOT NULL DEFAULT 'text',  -- extensible beyond text later
  data            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);