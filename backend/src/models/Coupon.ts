import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  discount: number
  appliesToAll: boolean
  products: mongoose.Types.ObjectId[]
  isActive: boolean
  createdAt: Date
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: Number, required: true, min: 1, max: 100 },
  appliesToAll: { type: Boolean, default: false },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ICoupon>('Coupon', CouponSchema)
