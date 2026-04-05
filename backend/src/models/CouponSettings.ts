import mongoose, { Schema, Document } from 'mongoose'

export interface ICouponSettings extends Document {
  globalEnabled: boolean
}

const CouponSettingsSchema = new Schema<ICouponSettings>({
  globalEnabled: { type: Boolean, default: false },
})

export default mongoose.model<ICouponSettings>('CouponSettings', CouponSettingsSchema)
