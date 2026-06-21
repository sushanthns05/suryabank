import pg from 'pg';
const { Pool } = pg;

const RENDER_DB_URI = 'postgresql://suryabank_db_user:B3NmOwGhFkOhuKs8mqxWP164tl4bJw3B@dpg-d8r75m6rnols73f1i2o0-a.oregon-postgres.render.com/suryabank_db';

const pool = new Pool({
  connectionString: RENDER_DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

async function wipe() {
  try {
    console.log("Connecting to database...");
    
    // Check if tables exist before deleting, just in case
    
    const resUsers = await pool.query('DELETE FROM users');
    console.log(`Deleted ${resUsers.rowCount} users.`);
    
    const resConsult = await pool.query('DELETE FROM consultations');
    console.log(`Deleted ${resConsult.rowCount} consultations.`);
    
  } catch (e) {
    console.error("Error:", e);
  } finally {
    pool.end();
  }
}

wipe();
