import { Pool } from "pg";
import path from "path";
import { config } from "dotenv";

const ENV = process.env.NODE_ENV || "development";

config({
  path: path.resolve(process.cwd(), `./.env.${ENV}`),
});
if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
}

let poolOptions = {};

// neon is hosted DB
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "neon") {
  poolOptions = {
    connectionString: process.env.DATABASE_URL,
    // false because neon uses self-signed certificates
    ssl: { rejectUnauthorized: false },
  };
}

const pool = new Pool(poolOptions);
export default pool;
