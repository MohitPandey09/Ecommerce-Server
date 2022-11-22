import { Document } from 'mongoose';

export interface ICoupon extends Document {
  name: string;
  applicablePrice: number;
  discount: number;
  isActive: number;
  isDeleted: number;
  created_at: Date;
  updated_at: Date;
}
