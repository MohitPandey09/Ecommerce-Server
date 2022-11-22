import { Request, Response, NextFunction } from 'express';
import CustomError from '../error-handler/custom-error.model';
import Coupon from '../models/coupon.model';
import Cart from '../models/cart.model';
import { ICart } from '../interfaces/cart.interface';

export default class CouponController {
  /**
   * Check coupon
   * @param req
   * @param res
   * @param next
   */
  public static async checkCoupon(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { couponCode } = req.params;
    try {
      // Check coupon is active and available
      const coupon = await Coupon.findOne({ coupon: couponCode, isActive: 1 });

      if (coupon !== null) {
        // Get cart for user
        const cart = await Cart.findOne({ userID: req.user });
        if (cart !== null) {
          // Check cart value is valid for coupon
          // TODO: logic for applicableprice should be % of totalprice
          if (cart.totalPrice >= coupon.applicablePrice) {
            // Calculate discount
            const discountAmount = parseInt(
              String((cart.totalPrice * coupon.discount) / 100)
            );
            const finalPrice = parseInt(
              String(cart.totalPrice - discountAmount)
            );
            // await Cart.findUpdate()
            res.status(200).json({
              statusCode: 1,
              message: 'Coupon Applied',
              responseData: { discountAmount, finalPrice },
            });
          } else {
            console.log(coupon);
            res.json({
              statusCode: 0,
              msgCode: 464,
              message: `Cart value should be ${coupon.applicablePrice} or above`,
            });
          }
        } else {
          res.json({
            statusCode: 0,
            msgCode: 464,
            message: 'No items in cart.',
          });
        }
      } else {
        res.json({
          statusCode: 0,
          msgCode: 465,
          message: 'Invalid coupon code',
        });
      }
    } catch (error) {
      console.log('Server Error: ', error);
      next(new CustomError(500, 'Server Error, Something went wrong!'));
    }
  }
}
