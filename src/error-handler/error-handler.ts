import CustomError from './custom-error.model';
import { NextFunction, Response, Request } from 'express';

export default function ErrorHandler(
  error: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = error;

  if (error instanceof CustomError) {
    customError = new CustomError(500, 'Oops, something went wrong');
  }

  res.status((customError as CustomError).status).send(customError);
}
