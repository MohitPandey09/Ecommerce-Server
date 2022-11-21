import { model, Model, Schema } from 'mongoose';
import { ICategory } from '../interfaces/category.interface';

const categorySchema = new Schema({
  name: String,
  isDeleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category: Model<ICategory> = model<ICategory>('Category', categorySchema);
export default Category;
