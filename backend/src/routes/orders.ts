import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/', createOrder);
router.get('/', authMiddleware, getOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);

export default router;