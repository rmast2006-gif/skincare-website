import express from 'express'
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleGlobal,
  toggleCoupon,
  validateCoupon,
} from '../controllers/couponController'
import { verifyAdmin } from '../middleware/auth'

const router = express.Router()

router.get('/', verifyAdmin, getCoupons)
router.post('/create', verifyAdmin, createCoupon)
router.delete('/:id', verifyAdmin, deleteCoupon)
router.patch('/toggle-global', verifyAdmin, toggleGlobal)
router.patch('/:id/toggle', verifyAdmin, toggleCoupon)
router.post('/validate', validateCoupon)

export default router
