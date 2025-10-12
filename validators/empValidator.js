const { body } = require('express-validator');

exports.createEmpValidator = [
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('email').isEmail(),
  body('position').notEmpty(),
  body('salary').isNumeric(),
  body('date_of_joining').isISO8601(),
  body('department').notEmpty()
];

exports.updateEmpValidator = [
  body('email').optional().isEmail(),
  body('salary').optional().isNumeric(),
  body('date_of_joining').optional().isISO8601()
];