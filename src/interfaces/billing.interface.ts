import { Document, Types } from 'mongoose';

export interface IAddress extends Document {
  line1: string;
  postal_code: number;
  city: string;
  state: string;
  country: string;
}

export interface IBillingDetails extends Document {
  name: string;
  email: string;
  phone: number;
  address: IAddress;
}

export interface IBilling extends Document {
  user: Types.ObjectId;
  billing_details: [IBillingDetails];
  isDeleted: number;
  created_at: Date;
  updated_at: Date;
}
