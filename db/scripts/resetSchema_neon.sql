-- Reset the schema (cannot drop DB on Neon)
BEGIN;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO PUBLIC;
COMMIT;

-- Already connected to the Neon DB via -d "$DATABASE_URL"
--    So we skip \connect

-- Apply schema files
\ir ../schema/20250829_1354_create_tables.sql
\ir ../schema/20250829_1457_add_constraints.sql
\ir ../schema/20250829_1458_add_indexes.sql

-- Seed minimal data 
\ir ../seeds/20250829_1502_minimal.sql