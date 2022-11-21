import { Router } from 'express';
import UserController from '../controllers/user.controller';
import {
  validateReqForLogin,
  validateReqForRegister,
} from '../middlewares/validator.middleware';
import AuthController from '../auth/auth.controller';
import CategoryController from '../controllers/category.controller';
import SubcategoryController from '../controllers/subcategory.controller';

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

    this.router.get(
      '/getCategories',
      AuthController.authenticateJWT,
      CategoryController.getCategoriesList
    );

    this.router.get(
      '/getSubCategoriesByID/:categoryID',
      AuthController.authenticateJWT,
      SubcategoryController.getSubCategoriesByID
    );
  }
}
