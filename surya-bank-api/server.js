import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// API Test Endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Connected to Render PostgreSQL Backend Successfully! 🚀' });
});

const JWT_SECRET = process.env.JWT_SECRET || 'surya-bank-super-secret-key-2026';

// Note: The URI provided is an INTERNAL Render URL. 
// It will only work if this Node.js app is also hosted on Render.
// For local testing, we would normally use the External URL (e.g. adding .oregon-postgres.render.com)
const RENDER_DB_URI = 'postgresql://suryabank_db_user:B3NmOwGhFkOhuKs8mqxWP164tl4bJw3B@dpg-d8r75m6rnols73f1i2o0-a/suryabank_db';

const pool = new Pool({
  connectionString: RENDER_DB_URI,
  ssl: {
    rejectUnauthorized: false // Required for Render external connections
  }
});

const initDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        topic VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(50),
        present_address TEXT,
        permanent_address TEXT,
        government_id VARCHAR(100),
        account_type VARCHAR(50),
        account_number VARCHAR(50),
        ifsc_code VARCHAR(50),
        role VARCHAR(50) DEFAULT 'customer',
        balance NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createUsersTableQuery);
    
    console.log('✅ PostgreSQL Database connected and tables are ready.');
  } catch (err) {
    console.error('❌ PostgreSQL Initialization Error:');
    console.error('If you are running this locally, the connection failed because the URI provided is an internal Render network address.');
    console.error('You need the External Database URL from the Render Dashboard to run it on localhost.');
  }
};

initDB();

app.post('/api/consultations', async (req, res) => {
  try {
    const { name, email, date, topic } = req.body;
    
    // Server-side validation
    if (!name || !email || !date || !topic) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const insertQuery = `
      INSERT INTO consultations (name, email, date, topic)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [name, email, date, topic]);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error inserting consultation:', err);
    res.status(500).json({ success: false, error: 'Database insertion failed' });
  }
});

// Get Consultations
app.get('/api/consultations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consultations ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Fetch consultations error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch consultations' });
  }
});

// Verify Consultation
app.put('/api/consultations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE consultations SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Consultation not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Verify consultation error:', err);
    res.status(500).json({ success: false, error: 'Failed to update consultation' });
  }
});

// --- AUTHENTICATION ENDPOINTS ---

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      fullName, email, password, mobileNumber, presentAddress, 
      permanentAddress, governmentId, accountType, role, balance 
    } = req.body;

    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate bank details if customer
    const accNo = role === 'employee' || role === 'admin' ? null : Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const ifsc = role === 'employee' || role === 'admin' ? null : 'SURY0001234';

    const insertQuery = `
      INSERT INTO users (
        full_name, email, password, mobile_number, present_address, 
        permanent_address, government_id, account_type, account_number, 
        ifsc_code, role, balance
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, full_name, email, role, account_number;
    `;
    
    const values = [
      fullName, email, hashedPassword, mobileNumber, presentAddress,
      permanentAddress, governmentId, accountType, accNo, ifsc, 
      role || 'customer', balance || 0
    ];

    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    // Remove password before sending
    delete user.password;
    
    res.json({ success: true, token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// --- CUSTOMER MANAGEMENT ENDPOINTS ---

// Get all customers (For Employee Dashboard)
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, full_name as "fullName", email, mobile_number as "mobileNumber", 
             account_number as "accountNumber", ifsc_code as "ifscCode", 
             account_type as "accountType", balance
      FROM users 
      WHERE role = 'customer'
      ORDER BY created_at DESC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Fetch customers error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running on http://localhost:${PORT}`);
});
