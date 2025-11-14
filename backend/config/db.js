import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Support Render DATABASE_URL or your POSTGRES_URL
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || null;

if (!connectionString) {
  console.warn(
    "⚠️ No DATABASE_URL or POSTGRES_URL set. Database connections will fail."
  );
}

// Enable SSL in production or if Render requires it
let sslOption = false;
if (
  process.env.PGSSLMODE === "require" ||
  process.env.DB_SSL === "true" ||
  process.env.NODE_ENV === "production"
) {
  sslOption = { rejectUnauthorized: false };
}

export const pool = new Pool({
  connectionString,
  ssl: sslOption,
});

// Test DB connection
export const testConnection = async () => {
  try {
    const res = await pool.query("SELECT 1 as ok");
    return res.rows[0];
  } catch (err) {
    throw err;
  }
};
