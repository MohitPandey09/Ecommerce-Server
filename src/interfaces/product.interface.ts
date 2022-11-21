import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  availableSize: Types.Array<string>;
  availableColors: Types.Array<string>;
  discount: number;
  weight: string;
  inStock: number;
  productAvailable: boolean;
  discountAvailable: boolean;
  isDeleted: number;
  created_at: Date;
  updated_at: Date;
}
