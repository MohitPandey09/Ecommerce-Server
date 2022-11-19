import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validateReqForLogin } from '../middlewares/validator.middleware';

export default class ApiRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post('/login', validateReqForLogin(), UserController.login);
  }
}
