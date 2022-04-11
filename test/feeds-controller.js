const { expect } = require('chai')
const User = require('../models/user')
const FeedController = require('../controllers/feeds')
const mongoose = require('mongoose')

describe('Validate Post controller', function () {
    before(function (done) {
        mongoose.connect('mongodb+srv://falguniparghi:8aUwV9B1Ll3CAn55@cluster0.6drto.mongodb.net/feeds-test?retryWrites=true&w=majority').then(result => {
            const user = new User({
                email: 'testuser@test.com',
                password: 'Test1234',
                name: 'test user',
                _id: '624fd0aec297d1e5a97319c4',
                posts: []
            })
            return user.save();
        })
            .then(() => {
                done();
            });
    });

    it('should return post after creating post', function (done) {

        const req = {
            body: {
              title: 'Test Post',
              content: 'A Test Post',
              imageUrl:'/test',
            },
            userId: '624fd0aec297d1e5a97319c4'
          };

        const res = {
            status: function() {
              return this;
            },
            json: function() {}
          };

        FeedController.addPosts(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
          });

    })

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });

})