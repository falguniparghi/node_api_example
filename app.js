const express = require("express");
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH')
    res.setHeader('Access-Control-Allow-Headers','content-type, Authorization')
    next();
});

app.use((error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json(message);
  });


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

mongoose.connect ('uri').then(result => {
    app.listen(8080);
}

).catch(
    err => {
        console.log(err);
    }
)

