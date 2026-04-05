import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const hash = await bcrypt.hash('Ammar', 10);
  await mongoose.connection.collection('admins').updateOne(
    {},
    { $set: { email: 'a.altawil@mazayaunited.com', password: hash } }
  );
  console.log('✅ Credentials updated successfully');
  process.exit(0);
}

updateAdmin().catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});