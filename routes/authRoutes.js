const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../validators/authValidator');

router.post('/user/signup', signupValidator, authCtrl.signup);
router.post('/user/login', loginValidator, authCtrl.login);

module.exports = router;