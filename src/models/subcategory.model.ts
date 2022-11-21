import mongoose, { model, Model, Schema } from 'mongoose';
import { ISubcategory } from '../interfaces/subcategory.interface';

const subcategorySchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: String,
  description: String,
  image: String,
  isDeleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Subcategory: Model<ISubcategory> = model<ISubcategory>(
  'Subcategory',
  subcategorySchema
);
export default Subcategory;
