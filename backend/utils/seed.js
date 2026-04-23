require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db');

async function seed() {
  try {
    const hash = await bcrypt.hash('13135@skynet', 12);
    await db.execute(
      `INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password = ?, role = 'admin'`,
      ['loganmullahh', hash, hash]
    );
    console.log('✅  Admin seeded: loganmullahh / 13135@skynet');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}
seed();
 

async function seedd() {
  try {
    const hash = await bcrypt.hash('13135@skynot', 12);
    await db.execute(
      `INSERT INTO users (username, password, role) VALUES (?, ?, 'staff')
       ON DUPLICATE KEY UPDATE password = ?, role = 'staff'`,
      ['tresor', hash, hash]
    );
    console.log('✅  staff seeded: tresor / 13135@skynot');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}
seedd();