const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    let isAuth
    if (!authHeader) {
        isAuth = false;
        return next()
    }

    const jwt = authHeader.split(' ')['1'];
    const decodedToken = jsonwebtoken.verify(jwt, 'secretkey');
    if (!decodedToken) {
        isAuth = false;
        return next()
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}