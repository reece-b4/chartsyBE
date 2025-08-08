import { Pool, PoolConfig } from "pg";
import path from "path";
import { config } from "dotenv";

const ENV = process.env.NODE_ENV || "development";

config({
  path: path.resolve(process.cwd(), `./.env.${ENV}`),
});

let poolOptions: PoolConfig = {};

// neon is hosted DB
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "neon") {
  poolOptions = {
    connectionString: process.env.DATABASE_URL,
    // false because neon uses self-signed certificates
    ssl: { rejectUnauthorized: false },
  };
}

if (!poolOptions.connectionString && !process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
}

const pool = new Pool(poolOptions);
export default pool;
