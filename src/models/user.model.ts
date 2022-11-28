import { model, Model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>({
  role: { type: Number, default: 2 },
  name: String,
  email: String,
  password: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  mobile: String,
  email_verified: Number,
  stripe_customer_id: String,
  isDeleted: { type: Number, default: 0 },
  isBlocked: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
  const user = this;

  bcrypt.genSalt(10, (err: any, salt: any) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err: any, hashPassword: string) => {
      if (err) return next(err);

      user.password = hashPassword;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: any
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: any, isMatch: boolean) => {
      callback(err, isMatch);
    }
  );
};

const User: Model<IUser> = model<IUser>('User', userSchema);
export default User;
