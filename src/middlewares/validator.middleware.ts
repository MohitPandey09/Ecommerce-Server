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
