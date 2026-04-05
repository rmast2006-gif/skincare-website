import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productName: string;
  brand: string;
  quantity: number;
  price: number;
  notes: string;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  timestamp: Date;
}

const OrderSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerAddress: { type: String, required: true },
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered'], default: 'Pending' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);