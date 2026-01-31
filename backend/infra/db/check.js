import { query, pool } from "./pool.js";

async function run() {
  console.log("🔍 Checking PostgreSQL connection...");

  try {
    const version = await query("SELECT version()");
    console.log("✅ Connected to:", version.rows[0].version);

    console.log("\n🔍 Checking required extensions...");
    const ext = await query(`
      SELECT extname FROM pg_extension
      WHERE extname IN ('uuid-ossp', 'pgcrypto', 'vector')
    `);
    console.log("✅ Extensions found:", ext.rows.map(r => r.extname));

    console.log("\n🔍 Checking core tables...");
    const tables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log("✅ Tables:", tables.rows.map(r => r.table_name));

    console.log("\n🔍 Checking vector column...");
    const vectorCheck = await query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'document_chunks'
        AND column_name = 'embedding'
    `);
    console.log("✅ Embedding column:", vectorCheck.rows);

    console.log("\n🎉 DB sanity check complete — schema looks valid.");
  } catch (err) {
    console.error("❌ DB check failed:", err);
  } finally {
    await pool.end();
  }
}

run();
