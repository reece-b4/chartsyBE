import { Pool } from "pg";
import path from "path";
import { config } from "dotenv";

const ENV = process.env.NODE_ENV || "development";

config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});
if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
}

const pool = new Pool();
export default pool;
