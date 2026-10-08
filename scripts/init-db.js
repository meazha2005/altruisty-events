const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initDB() {
  const host = process.env.DB_HOST || '192.169.147.255';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'MEAZHA';
  const password = process.env.DB_PASS || 'dZYRYi(o(0*U';
  const database = process.env.DB_NAME || 'le_test';

  console.log(`Connecting to MySQL at ${host}:${port}/${database}...`);
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    connectTimeout: 15000,
  });

  try {
    console.log('Creating tables with prefix altst_events_1_...');

    // 1. altst_events_1_registrations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS altst_events_1_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id VARCHAR(64) UNIQUE NOT NULL,
        team_name VARCHAR(255) NOT NULL,
        team_size INT NOT NULL,
        idea_title VARCHAR(255) NOT NULL,
        domain VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        amount INT NOT NULL DEFAULT 99,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        payment_status ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
        razorpay_order_id VARCHAR(100) NULL,
        razorpay_payment_id VARCHAR(100) NULL,
        razorpay_signature VARCHAR(255) NULL,
        email_sent TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_status (payment_status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altst_events_1_registrations table ready');

    // 2. altst_events_1_members
    await connection.query(`
      CREATE TABLE IF NOT EXISTS altst_events_1_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        registration_id INT NOT NULL,
        team_id VARCHAR(64) NOT NULL,
        member_number INT NOT NULL,
        is_leader TINYINT(1) NOT NULL DEFAULT 0,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        college_name VARCHAR(255) NOT NULL,
        dept VARCHAR(255) NOT NULL,
        year_of_study VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_reg_id (registration_id),
        INDEX idx_team_id (team_id),
        CONSTRAINT fk_altst_reg FOREIGN KEY (registration_id) 
          REFERENCES altst_events_1_registrations (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altst_events_1_members table ready');

    // 3. altst_events_1_admins
    await connection.query(`
      CREATE TABLE IF NOT EXISTS altst_events_1_admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) DEFAULT 'Admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ altst_events_1_admins table ready');

    // Seed default admin if not exists
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin@hackpick2026';
    const [existingAdmins] = await connection.query(
      'SELECT id FROM altst_events_1_admins WHERE username = ?',
      [adminUser]
    );

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);

    if (existingAdmins.length === 0) {
      await connection.query(
        'INSERT INTO altst_events_1_admins (username, password_hash, name) VALUES (?, ?, ?)',
        [adminUser, hash, 'Super Admin']
      );
      console.log(`✓ Admin user "${adminUser}" created with initial credentials.`);
    } else {
      // update password hash to ensure credentials match .env
      await connection.query(
        'UPDATE altst_events_1_admins SET password_hash = ? WHERE username = ?',
        [hash, adminUser]
      );
      console.log(`✓ Admin user "${adminUser}" credentials updated.`);
    }

    console.log('All altst_events_1_ tables initialized successfully!');
  } catch (err) {
    console.error('Error during database initialization:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

initDB();
