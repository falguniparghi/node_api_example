
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwtToken = require('jsonwebtoken');
const user = require('../models/user');
const Post = require('../models/post');
const isAuth = require('../middleware/is-auth');
const post = require('../models/post');
module.exports =
{
    signup: async function ({ userInput }, req) {
        const error = []
        if (!validator.isEmail(userInput.email)) {
            error.push('invalid Email ID');
        }
        if (!validator.isLength(userInput.password, { min: 5 })) {
            error.push('invalid Password');
        }

        if (error.length > 0) {
            const err = new Error('Invalid Input');
            err.code = 421
            err.data = error
            throw err;
        }
        const email = userInput.email;
        const password = userInput.password;
        const name = userInput.name;
        const isEmailExist = await User.findOne({ email: email });
        if (isEmailExist) {
            const err = new Error('Email Already Exist!');
            throw err;
        }
        const HashedPwd = await bcrypt.hash(password, 10);
        const user = new User({
            email: email,
            password: HashedPwd,
            name: name
        });
        const userData = await user.save();
        if (!userData) {
            const err = new Error('Internal Server Error');
            throw err;
        }

        return { ...userData._doc, _id: userData._id.toString() };
    },
    login: async function ({ email, password }) {
        const error = []
        if (!validator.isEmail(email)) {
            error.push('invalid Email ID');
        }
        if (!validator.isLength(password, { min: 5 })) {
            error.push('invalid Password');
        }

        if (error.length > 0) {
            const err = new Error('Invalid Input');
            err.code = 421
            err.data = error
            throw err;
        }

        const userData = await User.findOne({ email: email });
        if (!userData) {
            const err = new Error('Email ID is not registered!');
            throw err;
        }

        const pwdCheck = await bcrypt.compare(password, userData.password);
        if (!pwdCheck) {
            const err = new Error('Invalid Password.');
            throw err;
        }

        const token = await jwtToken.sign({
            email: userData.email,
            userId: userData._id.toString()
        }, 'secretkey', { 'expiresIn': '1h' })

        return {
            userId: userData._id.toString(),
            token: token
        }
    },
    createPost: async function ({ postInput }, req) {
        if (!req.isAuth) {
            const err = new Error('Access Denied')
            throw err;
        }
        const title = postInput.title;
        const content = postInput.content;
        const imageUrl = postInput.imageUrl;
        const error = [];

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            error.push({ 'message': 'title is invalid' })
        }

        if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
            error.push({ 'message': 'content is invalid' })
        }

        if (error.length > 0) {
            const err = new Error('Invalid arguments')
            err.code = 421
            err.data = error
            throw err;
        }

        const user = await User.findById(req.userId);

        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: user
        })

        user.posts.push(post);
        await user.save();

        const postData = await post.save();

        if (!postData) {
            const err = new Error('Server Error')
            throw err;
        }

        return { ...postData._doc, id: postData._id.toString() }

    },
    getAllPosts: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('Authorization failed');
            err.status = 401;
            throw err;
        }

        const postData = await Post
            .find()
            .populate('creator')
        const totalPosts = await Post.find().countDocuments()
        return {
            posts: postData.map(item => {
                return {
                    ...item._doc,
                    '_id': item._id.toString()
                }
            }),
            totalCount: totalPosts

        }
    },
    getPostById: async function ({ id }, req) {
        if (!req.isAuth) {
            const err = new Error('Authorization failed');
            err.status = 401;
            throw err;
        }

        const postData = await Post
            .findById(id)
            .populate('creator')
            console.log(postData);

        return {
            ...postData._doc
        }
    },
    updatePost: async function ({ id, postInput }, req) {
        if (!req.isAuth) {
            const err = new Error('Access Denied')
            throw err;
        }
        const title = postInput.title;
        const content = postInput.content;
        const imageUrl = postInput.imageUrl;
        const error = [];

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            error.push({ 'message': 'title is invalid' })
        }

        if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
            error.push({ 'message': 'content is invalid' })
        }

        if (error.length > 0) {
            const err = new Error('Invalid arguments')
            err.code = 421
            err.data = error
            throw err;
        }

        const post = await Post.findById(id).populate('creator');
        if (!data) {
            const err = new Error('No Post Found')
            throw err;
        }

        if (post.creator._id.toString() !== req.userId.toString()) {
            const err = new Error('Access Denied')
            throw err;
        }

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        const postData = await Post.save();

        if (!postData) {
            const err = new Error('Server Error')
            throw err;
        }

        return { ...postData._doc, id: postData._id.toString() }
    },

    deletePost: async function ({ id }, req) {
        if (!isAuth) {
            const err = new Error('Access Denied')
            throw err;
        }

        const isPostExist = await Post.findById(id);
        if (!isPostExist) {
            const err = new Error('Post Not found');
            err.status = '401'
            throw err;
        }
        console.log(isPostExist);

        console.log(isPostExist.creator.toString());
        console.log(req.userId.toString());

        if (isPostExist.creator.toString() !== req.userId.toString()) {
            const err = new Error('Access Denied')
            throw err;
        }
        await Post.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        user.posts.pull(isPostExist);
        await user.save();
        return true;
    }

}

