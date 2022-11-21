import { Request, Response, NextFunction } from 'express';
import CustomError from '../error-handler/custom-error.model';
import Subcategory from '../models/subcategory.model';

export default class SubcategoryController {
  /**
   * Get subcategories list by id
   * @param req
   * @param res
   * @param next
   */
  public static async getSubCategoriesByID(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subcategories = await Subcategory.find({
        category: req.params.categoryID,
      })
        .populate('category', 'name')
        .exec();

      if (subcategories !== null) {
        res.status(200).json({
          statusCode: 1,
          message: 'Sub-Category List',
          responseData: subcategories,
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
      next(new CustomError(500, 'Server Error, Something went wrong!'));
    }
  }
}
