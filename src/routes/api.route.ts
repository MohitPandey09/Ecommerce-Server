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
import FavouriteController from '../controllers/favourite.controller';
import CouponController from '../controllers/coupon.controller';
import StripeController from '../controllers/stripe.controller';

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

    this.router.delete(
      '/emptyCart',
      AuthController.authenticateJWT,
      CartController.emptyCart
    );

    this.router.get(
      '/getFavourites',
      AuthController.authenticateJWT,
      FavouriteController.getFavourites
    );

    this.router.get(
      '/favourite/:productID',
      AuthController.authenticateJWT,
      FavouriteController.favourite
    );

    this.router.get(
      '/checkCoupon/:couponCode',
      AuthController.authenticateJWT,
      CouponController.checkCoupon
    );

    this.router.post(
      '/createCustomer',
      AuthController.authenticateJWT,
      StripeController.createCustomer
    );

    this.router.post('/payment', StripeController.createPaymentIntent);
  }
}
