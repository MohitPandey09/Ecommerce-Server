import { Request, Response, NextFunction } from 'express';
import Cart from '../models/cart.model';
import Stripe from 'stripe';
import { ICart } from '../interfaces/cart.interface';
import User from '../models/user.model';
import Billing from '../models/billing.model';
import CustomError from '../error-handler/custom-error.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default class StripeController {
  /**
   * Create customer
   * @param req
   * @param res
   * @param next
   */
  public static async createCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user: any = await User.findById(
      req.user,
      'stripe_customer_id'
    ).exec();

    // Check if customer is already created
    if (user?.stripe_customer_id) {
      const billingDetails = await Billing.findOne(
        { user: req.user },
        'billing_details'
      ).exec();

      res.status(200).json({
        statusCode: 1,
        message: 'Billing Address',
        responseData: billingDetails,
      });
    }

    // Create new stripe customer
    try {
      const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: {
          line1: req.body.line1,
          postal_code: req.body.postal_code,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
        },
      });

      // Updated the user with generated customer id
      await User.findByIdAndUpdate(req.user, {
        stripe_customer_id: customer.id,
      });

      // Create billing for user
      await new Billing({ user: req.user, billing_details: customer }).save();

      res.status(200).json({ statusCode: 1 });
    } catch (err: any) {
      switch (err.type) {
        case 'StripeInvalidRequestError':
          console.log('An invalid request occurred.', err.message);
          break;
        default:
          console.log('Server Error: ', err);
          break;
      }
      next(new CustomError(500, `Something went wrong, ${err.message}`));
    }
  }
}
