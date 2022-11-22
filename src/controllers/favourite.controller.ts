import { Request, Response, NextFunction } from 'express';
import CustomError from '../error-handler/custom-error.model';
import Favourite from '../models/favourite.model';

export default class FavouriteController {
  /**
   * Get favourite list
   * @param req
   * @param res
   * @param next
   */
  public static async getFavourites(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const favourite = await Favourite.findOne({ user: req.user }).populate(
        'product',
        'name price subcategory'
      );
      if (favourite !== null) {
        res.status(200).json({
          statusCode: 1,
          message: 'Favourites List',
          responseData: favourite,
        });
      } else {
        res.json({
          statusCode: 0,
          msgCode: 455,
          message: 'Not found',
        });
      }
    } catch (error) {
      console.log('Server Error: ', error);
      next(new CustomError(500, 'Server error, Something went wrong'));
    }
  }

  /**
   * Set product as favourite
   * @param req
   * @param res
   * @param next
   */
  public static async favourite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { productID } = req.params;
    try {
      // Check user exist or not
      const user = await Favourite.findOne({ user: req.user });
      if (user !== null) {
        // Check product exist or not
        const product = await Favourite.findOne(
          { user: req.user, product: productID },
          { 'product.$': 1 } // It returns first match from array
        );
        if (product !== null) {
          // If product exist remove from list
          const remove = await Favourite.findOneAndUpdate(
            { user: req.user, product: productID },
            { $pull: { product: productID } },
            { new: true }
          );
          res.status(200).json({
            statusCode: 1,
            message: 'Product removed from list',
            responseData: remove,
          });
        } else {
          // If product not exist add to list
          const update = await Favourite.findOneAndUpdate(
            { user: req.user },
            { $push: { product: productID } },
            { new: true }
          );
          res.status(200).json({
            statusCode: 1,
            message: 'Product added to list',
            responseData: update,
          });
        }
      } else {
        // If user not exist add to list
        const fav = new Favourite({
          user: req.user,
          product: productID,
        });
        const saved = await fav.save();
        res.status(200).json({
          statusCode: 1,
          message: 'Product added to list',
          responseData: saved,
        });
      }
    } catch (error) {
      console.log('Server Error: ', error);
      next(new Error('Server error, Something was wrong!'));
    }
  }
}
