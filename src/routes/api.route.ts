import { Router, Request, Response } from 'express';
import UserController from '../controllers/user.controller';
import {
  validateReqForLogin,
  validateReqForRegister,
} from '../middlewares/validator.middleware';
import AuthController from '../auth/auth.controller';

export default class ApiRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post('/login', validateReqForLogin(), UserController.login);

    this.router.post(
      '/register',
      validateReqForRegister(),
      UserController.register
    );
  }
}
