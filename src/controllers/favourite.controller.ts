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
}
