import { model, Model, Schema } from 'mongoose';
import { ICoupon } from '../interfaces/coupon.interface';

const couponSchema = new Schema<ICoupon>({
  name: String,
  isActive: Number,
  applicablePrice: Number,
  discount: Number,
  isDeleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Coupon: Model<ICoupon> = model<ICoupon>('Coupon', couponSchema);
export default Coupon;
