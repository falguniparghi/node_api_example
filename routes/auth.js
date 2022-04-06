const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');

const { body } = require('express-validator');

router.post('/signup', [
    body('email')
    .isEmail()
    .withMessage('Email ID is invalid')
    .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').isLength({ min: 5 }).isAlphanumeric()
    .withMessage('Minimum Password length should be 5'),
    body('name').isLength({min : 3})
    .withMessage('Minimum Name length should be 3'),

] ,authController.signup);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Email ID is invalid'),
    body('password').isLength({ min: 5 }).isAlphanumeric()
    .withMessage('Minimum Password length should be 5')
] ,authController.login )

module.exports = router;