DROP DATABASE IF EXISTS anon_tech_test_db;
CREATE DATABASE anon_tech_test_db;

\c anon_tech_test_db

CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    "status" VARCHAR CHECK ("status" IN ('pending', 'in_progress', 'complete')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    due TIMESTAMP,
    "priority" VARCHAR CHECK ("priority" IN ('low', 'medium', 'high', 'urgent')),
    "description" VARCHAR,
    tags VARCHAR[]
  );


