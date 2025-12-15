import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function dbPing() {
    const r = await pool.query(
        "SELECT current_user, current_database(), NOW() as now"
    );
    return r.rows[0];
}
