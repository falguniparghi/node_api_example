const express = require('express');

const routes = express.Router();

const feedController = require('../controllers/feeds');

const { body } = require('express-validator');

const Auth = require('../middleware/is-auth');


routes.get('/posts', Auth, feedController.getPosts)

routes.post('/posts',
Auth,
    body('title')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Title should be minimum 5 characters long '),
    body('content')
        .isLength({ min: 5 })
        .withMessage('Content should be minimum 5 characters long ')
    ,
    feedController.addPosts)

routes.get('/posts/:id', Auth, feedController.getPostById)

routes.put('/posts/:id', Auth, feedController.updatePost)

routes.delete('/posts/:id', Auth, feedController.deletePost)



module.exports = routes;





