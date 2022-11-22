import { Router } from 'express';
import UserController from '../controllers/user.controller';
import {
  validateReqForLogin,
  validateReqForRegister,
} from '../middlewares/validator.middleware';
import AuthController from '../auth/auth.controller';
import CategoryController from '../controllers/category.controller';
import SubcategoryController from '../controllers/subcategory.controller';
import ProductController from '../controllers/product.controller';
import CartController from '../controllers/cart.controller';

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

    this.router.get(
      '/getProductsBySubcategoryID/:subcategoryID',
      AuthController.authenticateJWT,
      ProductController.getProductsBySubcategoryID
    );

    this.router.get(
      '/getProductDetails/:productID',
      AuthController.authenticateJWT,
      ProductController.getProductDetails
    );

    this.router.post(
      '/addItemToCart',
      AuthController.authenticateJWT,
      CartController.addItemToCart
    );

    this.router.get(
      '/getCartItems',
      AuthController.authenticateJWT,
      CartController.getCartItems
    );

    this.router.delete(
      '/deleteCartItem/:productID',
      AuthController.authenticateJWT,
      CartController.deleteCartItem
    );
  }
}
