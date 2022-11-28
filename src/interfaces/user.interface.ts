import { Document } from 'mongoose';

export interface IUser extends Document {
  role: number;
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mobile: string;
  email_verified: number;
  stripe_customer_id: string;
  isDeleted: number;
  isBlocked: number;
  created_at: Date;
  updated_at: Date;
}
