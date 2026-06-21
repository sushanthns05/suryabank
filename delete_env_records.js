import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// We need to parse the internal URL to an external one for local script execution
const internalUri = process.env.DATABASE_URL;
let externalUri = internalUri;
if (internalUri && internalUri.includes('@dpg-')) {
  // Convert dpg-xxx-a to dpg-xxx-a.oregon-postgres.render.com (or try frankfurt/ohio/singapore)
  // But let's just try oregon first
  externalUri = internalUri.replace('-a/', '-a.oregon-postgres.render.com/');
}

console.log("Using URI:", externalUri);

const pool = new Pool({
  connectionString: externalUri,
  ssl: {
    rejectUnauthorized: false
  }
});

async function wipe() {
  try {
    console.log("Connecting to database...");
    
    const resUsers = await pool.query('DELETE FROM users');
    console.log(`Deleted ${resUsers.rowCount} users.`);
    
    const resConsult = await pool.query('DELETE FROM consultations');
    console.log(`Deleted ${resConsult.rowCount} consultations.`);
    
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    pool.end();
  }
}

wipe();
