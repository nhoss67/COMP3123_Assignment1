const { body } = require('express-validator');

exports.signupValidator = [
  body('username').isLength({ min: 3 }).withMessage('username must be at least 3 chars'),
  body('email').isEmail().withMessage('invalid email'),
  body('password').isLength({ min: 6 }).withMessage('password min 6 chars')
];

exports.loginValidator = [
  body('email').optional().isEmail().withMessage('invalid email'),
  body('username').optional().isString(),
  body('password').exists().withMessage('password is required')
];