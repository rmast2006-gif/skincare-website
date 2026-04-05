import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { comparePassword } from '../utils/password';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body || {};

    // ======================
    // VALIDATION
    // ======================
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // ======================
    // FIND ADMIN
    // ======================
    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // ======================
    // CHECK PASSWORD FIELD
    // ======================
    if (!admin.password) {
      console.error("Admin password missing in DB");
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // ======================
    // COMPARE PASSWORD
    // ======================
    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // ======================
    // JWT SECRET CHECK
    // ======================
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in .env");
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    // ======================
    // GENERATE TOKEN ✅ FIXED
    // ======================
    const token = jwt.sign(
      { id: admin._id, role: 'admin' }, // ✅ IMPORTANT
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};