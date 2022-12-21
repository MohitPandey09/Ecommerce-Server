import mongoose, { model, Model, Schema } from 'mongoose';
import {
  IOrder,
  IOrderItems,
  OrderStatus,
} from '../interfaces/order.interface';
import { IItems } from '../interfaces/cart.interface';

const productOrderSchema = new Schema<IItems>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
  price: Number,
});

const orderItemsSchema = new Schema<IOrderItems>({
  items: [productOrderSchema],
  totalPrice: Number,
  status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
});

const orderSchema = new Schema<IOrder>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orders: [orderItemsSchema],
});

const Order: Model<IOrder> = model<IOrder>('Order', orderSchema);
export default Order;
