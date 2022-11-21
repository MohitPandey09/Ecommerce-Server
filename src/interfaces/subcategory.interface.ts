import { Types } from 'mongoose';

export interface ISubcategory extends Document {
  category: Types.ObjectId;
  name: string;
  description: string;
  image: string;
  isDeleted: number;
  created_at: Date;
  updated_at: Date;
}
