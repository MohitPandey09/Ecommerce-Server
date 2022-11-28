import mongoose, { model, Model, Schema } from 'mongoose';
import { IBilling } from '../interfaces/billing.interface';

const addressSchema = new Schema({
  line1: String,
  postal_code: Number,
  city: String,
  state: String,
  country: String,
});

const billingDetailsSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  address: addressSchema,
});

const billingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  billing_details: [billingDetailsSchema],
  isDeleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Billing: Model<IBilling> = model<IBilling>('Billing', billingSchema);
export default Billing;
