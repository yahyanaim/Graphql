const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { truncate } = require('lodash');
const schema = require('./schema/schema')
const mongoose = require("mongoose")


const app = express();

// connect to database 
mongoose.connect('mongodb+srv://yahia:admin@graphql.wco88.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connection.once('open', () =>{
    console.log('connected to databse')
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
})); 

app.listen(4000, () =>{
    console.log('now listning for requests on port 4000');
});