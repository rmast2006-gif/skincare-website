import { Request, Response } from 'express'
import Coupon from '../models/Coupon'
import CouponSettings from '../models/CouponSettings'

async function getSettings() {
  let settings = await CouponSettings.findOne()
  if (!settings) settings = await CouponSettings.create({ globalEnabled: false })
  return settings
}

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().populate('products', 'name brand')
    const settings = await getSettings()
    console.log('[getCoupons] found:', coupons.length)
    res.json({ coupons, globalEnabled: settings.globalEnabled })
  } catch (e) {
    console.error('[getCoupons] error:', e)
    res.status(500).json({ error: 'Failed to fetch coupons' })
  }
}

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discount, appliesToAll, products } = req.body
    console.log('[createCoupon] payload:', req.body)

    if (!code || !discount) {
      return res.status(400).json({ error: 'Code and discount are required' })
    }
    if (discount < 1 || discount > 100) {
      return res.status(400).json({ error: 'Discount must be between 1 and 100' })
    }
    if (!appliesToAll && (!products || products.length === 0)) {
      return res.status(400).json({ error: 'Select at least one product or choose All Products' })
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() })
    if (existing) {
      return res.status(400).json({ error: 'Coupon code already exists' })
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      appliesToAll: !!appliesToAll,
      products: appliesToAll ? [] : products,
      isActive: true,
    })

    console.log('[createCoupon] created:', coupon.code)
    res.status(201).json({ success: true, coupon })
  } catch (e) {
    console.error('[createCoupon] error:', e)
    res.status(500).json({ error: 'Failed to create coupon' })
  }
}

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await Coupon.findByIdAndDelete(id)
    console.log('[deleteCoupon] deleted:', id)
    res.json({ success: true })
  } catch (e) {
    console.error('[deleteCoupon] error:', e)
    res.status(500).json({ error: 'Failed to delete coupon' })
  }
}

export const toggleGlobal = async (req: Request, res: Response) => {
  try {
    const settings = await getSettings()
    settings.globalEnabled = !settings.globalEnabled
    await settings.save()
    console.log('[toggleGlobal] globalEnabled now:', settings.globalEnabled)
    res.json({ globalEnabled: settings.globalEnabled })
  } catch (e) {
    console.error('[toggleGlobal] error:', e)
    res.status(500).json({ error: 'Failed to toggle' })
  }
}

export const toggleCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' })
    coupon.isActive = !coupon.isActive
    await coupon.save()
    console.log('[toggleCoupon]', coupon.code, 'isActive:', coupon.isActive)
    res.json({ success: true, isActive: coupon.isActive })
  } catch (e) {
    console.error('[toggleCoupon] error:', e)
    res.status(500).json({ error: 'Failed to toggle coupon' })
  }
}

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, productIds } = req.body
    console.log('[validateCoupon] code:', code, 'productIds:', productIds)

    const settings = await getSettings()
    if (!settings.globalEnabled) {
      return res.status(400).json({ error: 'Coupon system is disabled' })
    }

    const coupon = await Coupon.findOne({ code: code?.toUpperCase() })
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' })
    if (!coupon.isActive) return res.status(400).json({ error: 'Coupon is inactive' })

    let applicableProductIds: string[] = []

    if (coupon.appliesToAll) {
      applicableProductIds = productIds
    } else {
      const couponProductIds = coupon.products.map(p => p.toString())
      applicableProductIds = productIds.filter((id: string) =>
        couponProductIds.includes(id)
      )
    }

    if (applicableProductIds.length === 0) {
      return res.status(400).json({ error: 'Coupon does not apply to any product in your cart' })
    }

    console.log('[validateCoupon] applicable products:', applicableProductIds)
    res.json({
      success: true,
      discount: coupon.discount,
      appliesToAll: coupon.appliesToAll,
      applicableProductIds,
    })
  } catch (e) {
    console.error('[validateCoupon] error:', e)
    res.status(500).json({ error: 'Validation failed' })
  }
}
