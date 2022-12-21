import { Document, Types } from 'mongoose';
import { IItems } from './cart.interface';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRM = 'CONFIRM',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
}

export interface IOrderItems extends Document {
  items: Types.Array<IItems>;
  totalPrice: number;
  status: OrderStatus;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orders: Types.Array<IOrderItems>;
}
