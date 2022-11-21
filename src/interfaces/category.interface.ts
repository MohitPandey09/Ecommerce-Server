import { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  isDeleted: number;
  created_at: Date;
  updated_at: Date;
}
