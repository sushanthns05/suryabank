import pkg from 'pg';
const { Pool } = pkg;

const RENDER_DB_URI = 'postgresql://suryabank_db_user:B3NmOwGhFkOhuKs8mqxWP164tl4bJw3B@dpg-d8r75m6rnols73f1i2o0-a.oregon-postgres.render.com/suryabank_db';

const pool = new Pool({
  connectionString: RENDER_DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

async function deleteRecords() {
  try {
    console.log('Connecting to database...');
    
    // Delete all consultations
    const consultRes = await pool.query('DELETE FROM consultations RETURNING id');
    console.log(`Deleted ${consultRes.rowCount} consultation records.`);
    
    // Delete all users except perhaps an admin if one existed?
    // User asked to delete all user records. I will delete all.
    const userRes = await pool.query('DELETE FROM users RETURNING id');
    console.log(`Deleted ${userRes.rowCount} user records.`);
    
    console.log('Successfully cleared records.');
  } catch (error) {
    console.error('Error deleting records:', error);
  } finally {
    await pool.end();
  }
}

deleteRecords();
