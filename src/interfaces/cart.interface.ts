import { Document, Types } from 'mongoose';

export interface IItems extends Document {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userID: Types.ObjectId;
  items: [IItems];
  totalPrice: number;
  payment_intent: string;
  created_at: Date;
  updated_at: Date;
}
