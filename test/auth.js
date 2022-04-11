const { expect } = require('chai');
authMiddleware = require('../middleware/is-auth');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

describe('Validate Auth Middleware', function () {
    it('Should throw an error if authorization header is not present', function () {
      const req = {
        get: function(headerName){
          return null;
        }
      }
      expect(authMiddleware.bind(this,req, () => {})).to.throw('Authorization failed!!')
    });

    it('Should throw an error if authorization header is string', function () {
      const req = {
        get: function(headerName){
          return 'xyz';
        }
      }
      expect(authMiddleware.bind(this,req, () => {})).to.throw()
    });

    it('Get userId in response after decoding token', function () {
      const req = {
        get: function(headerName){
          return 'Bearer xyzdfdfdfdfdfdfd';
        }
      }
      sinon.stub(jwt, 'verify');
      jwt.verify.returns({'userId' : 'abc'});
      authMiddleware(req,{}, () => {})
      expect(req).to.have.property('userId');
      jwt.verify.restore()
    });
});