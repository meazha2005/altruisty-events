const mysql = require('mysql2/promise');
const Razorpay = require('razorpay');
require('dotenv').config();

async function testFlow() {
  console.log('Testing Razorpay Order Creation...');
  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const testTeamId = `HP-TEST-${Date.now().toString(36).toUpperCase()}`;
  const order = await rzp.orders.create({
    amount: 14900, // ₹149
    currency: 'INR',
    receipt: testTeamId,
    notes: {
      teamName: 'Test Innovators',
      testTeamId,
    },
  });

  console.log('✓ Razorpay live order created successfully:', order.id, 'Amount:', order.amount);

  console.log('Testing Database connection and insert into altst_events_1_registrations...');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [res] = await conn.query(
    `INSERT INTO altst_events_1_registrations 
     (team_id, team_name, team_size, idea_title, domain, description, amount, currency, payment_status, razorpay_order_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
    [
      testTeamId,
      'Test Innovators',
      2,
      'Smart Agri-Drone AI Monitoring',
      'agriculture',
      'Automated drone computer vision for crop disease detection and soil moisture indexing.',
      149,
      'INR',
      order.id,
    ]
  );
  console.log('✓ Registration inserted with ID:', res.insertId);

  // Insert members
  await conn.query(
    `INSERT INTO altst_events_1_members 
     (registration_id, team_id, member_number, is_leader, name, email, phone, college_name, dept, year_of_study)
     VALUES (?, ?, 1, 1, 'Rahul Leader', 'founder@ztoitech.com', '9876543210', 'Anna University', 'CSE', '3rd Year (Pre-final)'),
            (?, ?, 2, 0, 'Priya Member', 'altruistybusiess@gmail.com', '9876543211', 'Anna University', 'CSE', '3rd Year (Pre-final)')`,
    [res.insertId, testTeamId, res.insertId, testTeamId]
  );
  console.log('✓ 2 Members inserted successfully');

  // Verify fetch
  const [rows] = await conn.query(
    'SELECT * FROM altst_events_1_registrations WHERE team_id = ?',
    [testTeamId]
  );
  console.log('✓ Queried back registered team:', rows[0].team_name, 'Status:', rows[0].payment_status);

  // Clean up test entry so production data stays pristine
  await conn.query('DELETE FROM altst_events_1_registrations WHERE team_id = ?', [testTeamId]);
  console.log('✓ Cleaned up test record.');

  await conn.end();
  console.log('All end-to-end backend tests passed 100%!');
}

testFlow().catch(console.error);
