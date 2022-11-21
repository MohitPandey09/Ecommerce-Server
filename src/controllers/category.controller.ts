import { Request, Response, NextFunction } from 'express';
import { ICategory } from '../interfaces/category.interface';
import Category from '../models/category.model';
import CustomError from '../error-handler/custom-error.model';

export default class CategoryController {
  /**
   * Get categories list
   * @param req
   * @param res
   * @param next
   */
  public static async getCategoriesList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories: ICategory[] = await Category.find({
        isDeleted: 0,
      }).exec();

      if (categories !== null) {
        res.status(200).json({
          statusCode: 1,
          message: 'Category List',
          responseData: categories,
        });
      } else {
        res.json({
          statusCode: 0,
          msgCode: 452,
          message: 'Not found',
        });
      }
    } catch (error) {
      console.log('Server Error: ', error);
      next(new CustomError(500, 'Server error, Something went wrong'));
    }
  }
}
