import mongoose, { model, Model, Schema } from 'mongoose';
import { ICart } from '../interfaces/cart.interface';

const itemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
  price: Number,
});

const cartSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [itemSchema],
  totalPrice: { type: Number, default: 0 },
  payment_intent: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Cart: Model<ICart> = model<ICart>('Cart', cartSchema);
export default Cart;
