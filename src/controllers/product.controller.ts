import { Request, Response, NextFunction } from 'express';
import CustomError from '../error-handler/custom-error.model';
import Product from '../models/product.model';

export default class ProductController {
  /**
   * Get products by subcategory id
   * @param req
   * @param res
   * @param next
   */
  public static async getProductsBySubcategoryID(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await Product.find({
        subcategory: req.params.subcategoryID,
      }).populate('subcategory', 'name image');

      if (!product) {
        res.json({
          statusCode: 0,
          msgCode: 454,
          message: 'Product not found',
        });
      } else {
        res.status(200).json({
          statusCode: 1,
          message: 'Product List',
          responseData: product,
        });
      }
    } catch (error) {
      console.log('Server Error: ', error);
      next(new CustomError(500, 'Server error, Something went wrong'));
    }
  }

  /**
   * Get product details by id
   * @param req
   * @param res
   * @param next
   */
  public static async getProductDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await Product.findById({
        _id: req.params.productID,
      }).populate('subcategory', 'name');

      if (product !== null) {
        res.status(200).json({
          statusCode: 1,
          message: 'Product Details',
          responseData: product,
        });
      } else {
        res.json({
          statusCode: 0,
          msgCode: 453,
          message: 'Product not found',
        });
      }
    } catch (error) {
      console.log('Server Error: ', error);
      next(new CustomError(500, 'Server error, Something went wrong'));
    }
  }
}
