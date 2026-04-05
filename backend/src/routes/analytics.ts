import express from 'express';
import { getAnalytics, trackVisit } from '../controllers/analyticsController';
import auth from '../middleware/auth'; // ✅ correct import

const router = express.Router();

// 🔐 Protected route
router.get('/', auth, getAnalytics);

// 🌍 Public route (NO auth)
router.post('/track-visit', trackVisit);

export default router;