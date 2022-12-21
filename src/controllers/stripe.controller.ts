import { NextFunction, Request, Response } from 'express';
import Cart from '../models/cart.model';
import Stripe from 'stripe';
import { ICart } from '../interfaces/cart.interface';
import CustomError from '../error-handler/custom-error.model';
import Order from '../models/order.model';
import { IOrder, OrderStatus } from '../interfaces/order.interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export default class StripeController {
  /**
   * Create payment intent

   * @param req
   * @param res
   * @param next
   */
  public static async createPaymentMethod(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const cartItems: ICart | null = await Cart.findOne({
      user: req.user,
    }).exec();

    try {
      // If payment intent not created then create
      const paymentIntent: Stripe.PaymentIntent =
        await stripe.paymentIntents.create({
          payment_method: req.body.payment_method_id,
          amount: Number(cartItems?.totalPrice) * 100, // Stripe accept amount in cents only
          currency: 'inr',
          confirmation_method: 'manual',
          confirm: true,
        });

      res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (err: any) {
      console.log('Server Error: ', err);
      next(new CustomError(500, `Something went wrong, ${err.message}`));
    }
  }

  /**
   * Confirm payment intent
   * @param req
   * @param res
   * @param next
   */
  public static async confirmPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const cartItems: ICart | null = await Cart.findOne(
      {
        user: req.user,
      },
      'items'
    ).exec();

    try {
      if (req.body.payment_intent_id) {
        const confirmPaymentIntent: Stripe.PaymentIntent =
          await stripe.paymentIntents.confirm(req.body.payment_intent_id);

        if (confirmPaymentIntent.status === 'requires_action') {
          // Tell the client to handle the action
          res.json({
            requires_action: true,
            payment_intent_client_secret: confirmPaymentIntent.client_secret,
          });
        } else if (confirmPaymentIntent.status === 'requires_payment_method') {
          //   Handle payment intent failed
          res.json({
            success: false,
          });
        } else if (confirmPaymentIntent.status === 'succeeded') {
          // The payment didn't need any additional actions and is completed!
          // Create order
          await this.createOrder(req.user, cartItems);
          // Empty cart items against user
          await Cart.findOneAndRemove(req.user).exec();

          res.status(200).json({
            success: true,
          });
        } else {
          // Invalid status
          res.json({
            error: 'Invalid PaymentIntent status',
          });
        }
      }
    } catch (err: any) {
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          console.log(`A payment error occurred: ${err.message}`);
          break;
        case 'StripeRateLimitError':
          // Too many requests made to the API too quickly
          console.log('You made too many API calls in too short a time.');
          break;
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          console.log('An invalid request occurred.', err.message);
          break;
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          console.log('Something went wrong on Stripe’s end.');
          break;
        case 'StripeConnectionError':
          // Some kind of error occurred during the HTTPS communication
          console.log(
            'There was a network problem between your server and Stripe.'
          );
          break;
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          console.log(
            'Stripe can’t authenticate you with the information provided.'
          );
          break;
        default:
          console.log('Server Error: ', err);
          next(new CustomError(500, `Something went wrong, ${err}`));
          break;
      }
      res.status(400).send({
        success: false,
        info: err.message,
      });
    }
  }

  /**
   * Create/Update order
   * @param currentUser
   * @param cart
   */
  public static async createOrder(
    currentUser: any,
    cart: any
  ): Promise<IOrder> {
    let order;
    // Check if user have already orders array
    const ordersExists = await Order.findById(currentUser, 'orders').exec();

    if (ordersExists) {
      order = await Order.findByIdAndUpdate(
        currentUser,
        {
          $push: { items: cart.items },
        },
        { new: true }
      ).exec();
    } else {
      order = new Order({
        user: currentUser,
        orders: {
          items: cart.items,
          status: OrderStatus.PENDING,
          totalPrice: cart.totalPrice,
        },
      });
      await order.save();
    }

    return order as IOrder;
  }

  /**
   * delete many request
   * @param req
   * @param res
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    // res.status(200).json({ order, cartItems });
    // const deleted = await Billing.deleteMany({ user: req.user });
    // console.log(deleted, req.user);
    // res.status(200).json(deleted);
  }
}
