import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import './passport.controller';

export default class AuthController {
  /**
   * Authenticate valid request
   * @param req
   * @param res
   * @param next
   */
  public static authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err)
        return res.status(401).json({ status: 'Unauthorized', info: info });

      if (!user)
        return res.status(401).json({ status: 'Unauthorized', info: info });

      req.user = user;
      return next();
    })(req, res, next);
  }
}
