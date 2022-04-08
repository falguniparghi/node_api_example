const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        posts: [Post!]!
    }

    type authData {
        token: String!
        userId: ID!
    }

    type postData {
        posts: [Post!]!
        totalCount: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery {
        login(email:String!, password:String!): authData
        getAllPosts : postData
        getPostById(id:ID!) : Post!
    }

    type RootMutation {
        signup(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id:ID!, postInput: PostInputData): Post!
        deletePost(id:ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);