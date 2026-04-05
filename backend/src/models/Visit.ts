import mongoose, { Document, Schema } from 'mongoose';

export interface IVisit extends Document {
  date: string;
  count: number;
}

const VisitSchema: Schema<IVisit> = new Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model<IVisit>('Visit', VisitSchema);