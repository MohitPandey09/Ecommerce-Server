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
    // Check product is valid
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
      // Cart is not empty
      let updatedValue;
      const isProductAdded = cart.items.find(
        (item) => item.product == productID
      );

      if (isProductAdded) {
        // Item exists, increase quantity
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
        // Item not exists, add another item in cart
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
      // Cart is empty, save item in cart
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

  /**
   * Get cart items
   * @param req
   * @param res
   * @param next
   */
  public static async getCartItems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cart = await Cart.findOne({ userID: req.user }).populate(
        'items.product',
        '_id name'
      );
      if (cart !== null) {
        res.status(200).json({
          statusCode: 1,
          message: 'Cart Items',
          responseData: cart,
        });
      } else {
        res.json({
          statusCode: 0,
          msgCode: 461,
          message: cart,
        });
      }
    } catch (err) {
      console.log('Server Error: ', err);
      next(new CustomError(500, 'Server Error, Something went wrong!'));
    }
  }

  /**
   * Delete item from cart by id
   * @param req
   * @param res
   * @param next
   */
  public static async deleteCartItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { productID } = req.params;
    let condition, update;
    // Check product is available or not
    const product = await Product.findById(productID);
    if (product) {
      // Check product available & quantity is <=1
      const productInCart = await Cart.findOne(
        {
          userID: req.user,
          items: {
            $elemMatch: {
              // It matches the array with condition
              product: productID,
              quantity: { $lte: 1 },
            },
          },
        },
        { 'items.$': 1 }
      ); // It returns first match from array
      // Pull/delete product if quantity is <=1
      if (productInCart !== null) {
        (condition = {
          userID: req.user,
          items: { $elemMatch: { product: productID, quantity: { $lte: 1 } } },
        }),
          (update = {
            $inc: { totalPrice: -product.price },
            $pull: { items: { product: productID } },
          });
      } else {
        // Decrement quantity of product
        condition = { userID: req.user, 'items.product': productID };
        update = {
          $inc: { 'items.$.quantity': -1, totalPrice: -product.price },
        };
      }
      try {
        const cart = await Cart.findOneAndUpdate(condition, update, {
          new: true,
        });
        // If product is not found show error not found
        if (cart !== null) {
          res.status(200).json({
            statusCode: 1,
            message: 'Item Removed',
            responseData: cart,
          });
        } else {
          res.json({
            statusCode: 0,
            msgCode: 462,
            message: 'Not found',
          });
        }
      } catch (err) {
        console.log('Server Error: ', err);
        next(new CustomError(500, 'Server Error, Something went wrong!'));
      }
    } else {
      // If product not available
      res.json({
        statusCode: 0,
        msgCode: 463,
        message: 'Sorry, seems like your product is not available',
      });
    }
  }
}
