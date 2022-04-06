const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    try {
        const hasedPWd = await bcrypt.hash(password, 10);
        if (hasedPWd) {
            const user = new User({
                name: name,
                email: email,
                password: hasedPWd
            });
            const result = await user.save();

            if (result) {
                res.status('201').json({
                    message: 'New User Created',
                    id: result._id
                })
            }
        }
    } catch (err) {
        err.statusCode = 500
        next(err);

    }
}

exports.login = async (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    let loggedInUser;
    try {
        const result = await User.findOne({ email: email })

        if (!result) {
            res.statusCode = 401;
            throw new Error('Invalid Email ID');
        }
        loggedInUser = result;

        const passwordMatch = await bcrypt.compare(password, loggedInUser.password);

        if (!passwordMatch) {
            res.statusCode = 401;
            throw new Error('Invalid Password');
        }

        const token = await jwt.sign({ email: loggedInUser.email, userId: loggedInUser._id }, 'secretkey', { expiresIn: '1h' });

        if(token) {
            res.status('200').json({
                'message': 'Login Success',
                'token': token
            });
        } else {
            res.statusCode = 401;
            throw new Error('Authorization failed');
        }
        
    } catch (err) {
        err.statusCode = 500
        next(err);
    }
};
