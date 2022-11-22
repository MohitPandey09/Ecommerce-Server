import mongoose, { model, Model, Schema } from 'mongoose';
import { IFavourite } from '../interfaces/favourite.interface';

const cartSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  product: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Favourite: Model<IFavourite> = model<IFavourite>('Favourite', cartSchema);
export default Favourite;
