import { Document, Types } from 'mongoose';

export interface IFavourite extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}
