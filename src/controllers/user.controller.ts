import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import '../auth/passport.controller';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import CustomError from '../error-handler/custom-error.model';
import User from '../models/user.model';

export default class UserController {
  /**
   * Register user
   * @param req
   * @param res
   * @param next
   */
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      return res.status(422).json({ errors: validate.array() });
    }

    try {
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        mobile: req.body.mobile,
        email_verified: 0,
      });

      const savedUser = await user.save();

      if (savedUser) {
        return res.status(200).json({ message: 'Registered successfully' });
      }
    } catch (error) {
      console.log('Server error: ', error);
      next(
        new CustomError(500, 'Server error, Something was wrong here!', error)
      );
    }
  }

  /**
   * Login user
   * @param req
   * @param res
   * @param next
   */
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

      res.status(200).send({ token: token, userData: user });
    })(req, res, next);
  }
}
