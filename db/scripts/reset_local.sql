-- Run with:
-- psql -v ON_ERROR_STOP=1 -d postgres -f db/scripts/reset_local.sql
-- -v = set a psql variable, ERROR_STOP makes psql exit on first error (is a built in variable we are setting)
-- -d = database to connect to (postgres is default DB that always exists) and is maintenance db we use to drop & create our target DB
-- -f = file to run

--  originally had a DO $$ block here but dropping DB cannot be done inside a transaction block (A transaction is a safe “wrapper” around SQL commands)/(which do not commit unless full success of the block/can rollback if error) so dropping DB must be done at top level. psql was in quotes, we were using PL/pgSQL postgres's built in procedural language for the DO $$ block.
-- 1) Terminate open connections, drop & recreate the local DB
-- postgres won't let us drop database if there are open connections to it
-- 1) Terminate other sessions connected to chartsydb
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'chartsydb' AND pid <> pg_backend_pid();

-- 2) Drop & recreate the DB (must be plain SQL; not in a DO block/transaction)
DROP DATABASE IF EXISTS chartsydb;
CREATE DATABASE chartsydb;

-- 2) Connect the session to the fresh DB
\connect chartsydb
-- \connect switches psql to use the newly created database.

-- ir = 'include relative' (read and execute another SQL file relative to this file's path)
-- 3) Apply schema files (tables → constraints → indexes)
\ir ../schema/20250829_1354_create_tables.sql
\ir ../schema/20250829_1457_add_constraints.sql
\ir ../schema/20250829_1458_add_indexes.sql
-- \ir = “include relative”: runs another SQL file relative to THIS file’s path.

-- 4) Seed minimal data
\ir ../seeds/20250829_1502_minimal.sql