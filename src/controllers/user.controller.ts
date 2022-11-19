import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import '../auth/passport.controller';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export default class UserController {
  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const validate = validationResult(req);

    if (!validate.isEmpty())
      return res.status(422).json({ errors: validate.array() });

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);

      if (!user)
        return res.status(401).json({ status: 'Unauthorized', info: info });

      const token = jwt.sign(
        { email: user.email },
        process.env.APP_SECRET_KEY as string
      );

      res.status(200).send({ token: token });
    })(req, res, next);
  }
}
