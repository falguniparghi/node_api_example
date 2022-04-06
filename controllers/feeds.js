const Post = require('../models/post');

const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
    try {
        const result = await Post.find();

        if (!result) {
            const error = new Error('Data not found');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json(result);

    } catch (err) {
        next(err);

    }
}

exports.getPostById = async (req, res, next) => {
    try {
        const result = await Post.findById(req.params.id)

        if (!result) {
            const error = new Error('Data not found');
            error.statusCode = 500;
            throw error;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    };
}

exports.addPosts = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const title = req.body.title;
        const content = req.body.content;
        const imageUrl = './images/';
        const user_id = req.userId;
        const postObj = new Post({
            title,
            imageUrl,
            content,
            creator: user_id
        });
        let creator1;
        const post = await postObj.save();
        const user = await User.findById(user_id);
        creator1 = user;
        user.posts.push(postObj);
        const result = await user.save();
        if (result) {
            res.status(200).json({
                message: 'Post created successfully!',
                post: postObj,
                creator: { name: creator1.name, id: creator1._id }
            })
        }
    } catch (error) {
        next(error)
    }

}

exports.updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const title = req.body.title;
        const content = req.body.content;
        const imageUrl = './images/';
        Post.title = title
        Post.content = content
        Post.imageUrl = imageUrl
        const result = await Post.save();
        if (result) {
            res.status(200).json({
                msg: "Post Updated Successfully",
                data: result
            })
        }
    } catch (err) {
        err.statusCode = 500
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Post.findByIdAndDelete(id);
        const user = await User.findById(req.userId);
        user.posts.pull(id);
        const data = await user.save();
        if (data) {
            res.status(200).json({
                msg: "Post Deleted Successfully"
            })
        }

    } catch (error) {
        err.statusCode = 500
        next(err);

    }
}