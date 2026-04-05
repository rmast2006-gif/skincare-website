import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import { hashPassword } from './password';
import connectDB from '../config/database';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASSWORD!;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await hashPassword(password);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    console.log('Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();