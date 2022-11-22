import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';
import Cart from '../models/cart.model';
import CustomError from '../error-handler/custom-error.model';

export default class CartController {
  /**
   * Add item to cart
   * @param req
   * @param res
   * @param next
   */
  public static async addItemToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { productID } = req.body;
    // CHECK PRODUCT IS VALID
    const product = await Product.findById(productID);

    if (!product) {
      res.json({
        statusCode: 0,
        msgCode: 454,
        message: 'Invalid request, Product not Found',
      });
    }

    const items = {
      product: productID,
      quantity: 1,
      price: product?.price,
    };

    const cart = await Cart.findOne({ userID: req.user });

    if (cart) {
      // CART IS NOT EMPTY
      let updatedValue;
      const isProductAdded = cart.items.find(
        (item) => item.product == productID
      );

      if (isProductAdded) {
        // ITEM EXISTS INCREASE QUANTITY
        updatedValue = await Cart.findOneAndUpdate(
          { userID: req.user, 'items.product': productID },
          {
            $inc: {
              'items.$.quantity': 1,
              totalPrice: product?.price,
            },
          },
          { new: true }
        );
      } else {
        // ITEM NOT EXISTS ADD ANOTHER ITEM IN CART
        updatedValue = await Cart.findOneAndUpdate(
          { userID: req.user },
          {
            $push: { items: items },
            $inc: { totalPrice: product?.price },
          },
          { new: true }
        );
      }

      res.status(200).json({
        statusCode: 1,
        message: 'Item added successfully',
        responseData: updatedValue,
      });
    } else {
      // CART IS EMPTY SAVE ITEM IN CART
      const cartItem = new Cart({
        userID: req.user,
        items: [items],
        totalPrice: product?.price,
      });

      const savedCart = await cartItem.save();
      try {
        if (savedCart !== null) {
          res.status(200).json({
            statusCode: 1,
            message: 'Item added successfully',
            responseData: savedCart,
          });
        } else {
          res.json({
            statusCode: 0,
            msgCode: 460,
            message: savedCart,
          });
        }
      } catch (error) {
        console.log('Server Error: ', error);
        next(new CustomError(500, 'Server Error, Something went wrong!'));
      }
    }
  }
}
