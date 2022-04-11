const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const err = new Error('Authorization failed!!');
        err.statusCode = 401;
        throw err;
    }

    const jwt = authHeader.split(' ')['1'];
    const decodedToken = jsonwebtoken.verify(jwt, 'secretkey');
    if (!decodedToken) {
        const err = new Error('Authorization failed!');
        err.statusCode = 401;
        throw err;
    }
    req.userId = decodedToken.userId;
    next();
}