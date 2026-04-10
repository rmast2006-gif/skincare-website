import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';


import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import analyticsRoutes from './routes/analytics';
import couponRoutes from './routes/coupon';
import uploadRoutes from './routes/upload';
import messageRoutes from './routes/messages';
import orderRoutes from './routes/orders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5007;

// =======================
// MIDDLEWARE
// =======================

// ✅ FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

// =======================
// HEALTH CHECK ROUTE
// =======================
app.get('/', (req, res) => {
  res.send('API is running...');
});

// =======================
// ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);


// =======================
// DEBUG ROUTE (ADDED)
// =======================
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routes working' });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('GLOBAL ERROR:', err);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
);

// =======================
// START SERVER AFTER DB
// =======================
const startServer = async () => {
  try {
    await connectDB(); // ✅ wait for DB connection

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();