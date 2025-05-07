\c chartsydb

CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    "status" VARCHAR CHECK ("status" IN ('pending', 'in_progress', 'complete')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    due TIMESTAMP NOT NULL,
    "priority" VARCHAR CHECK ("priority" IN ('low', 'medium', 'high', 'urgent')) NOT NULL,
    "description" VARCHAR,
    tags VARCHAR[]
  );


