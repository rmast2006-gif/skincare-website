import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  brand: 'Topicrem' | 'Novexpert';
  category: string;
  images: string[];
  price: number; // in JOD
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  howToUse: {
    en: string;
    ar: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  brand: {
    type: String,
    enum: ['Topicrem', 'Novexpert'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  howToUse: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
}, {
  timestamps: true,
});

export default mongoose.model<IProduct>('Product', ProductSchema);