const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const resolver = require('./graphql/resolver');
const auth = require('./middleware/is-auth')

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

app.use(auth);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    formatError(err){
        if(!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'Invalid Arguments'
        const statusCode = err.originalError.code || '500'
         return {
             data : data,
             message: message,
             status : statusCode
         }
    }
}));

mongoose.connect ('mongodb+srv://falguniparghi:8aUwV9B1Ll3CAn55@cluster0.6drto.mongodb.net/feeds?retryWrites=true&w=majority').then(result => {
    app.listen(8080);
}

).catch(
    err => {
        console.log(err);
    }
)

