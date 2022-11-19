import { body } from 'express-validator';

export function validateReqForLogin() {
  return [
    body('email')
      .isEmail()
      .withMessage('Invalid email')
      .notEmpty()
      .withMessage('Email is required'),
    body('password')
      .isLength({ min: 5 })
      .notEmpty()
      .withMessage('Password is required'),
  ];
}

export function validateReqForRegister() {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('zip')
      .notEmpty()
      .withMessage('Zip is required')
      .isNumeric()
      .withMessage('Zip must be a number'),
    body('country').notEmpty().withMessage('Country is required'),
    body('mobile')
      .notEmpty()
      .withMessage('Mobile is required')
      .isNumeric()
      .withMessage('Mobile must be a number'),
    body('address').notEmpty().withMessage('Address is required'),
  ];
}
