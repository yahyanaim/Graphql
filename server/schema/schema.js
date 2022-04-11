const graphql = require('graphql');
const _ = require('lodash');
const Company = require('../models/compnay');
const Owner = require('../models/owner');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
} = graphql;

const CompanyType =  new GraphQLObjectType({
    name: 'Company',
    fields: () =>({
        id: {type: GraphQLID},
        name : { type : GraphQLString},
        domain : {type : GraphQLString},
        owner: {
            type: OwnerType,
            resolve(parent, args){
                console.log(parent)
                //return _.find(owners, {id : parent.ownerId});
                return Owner.findById(parent.ownerId);
            }
        }
    })
});

const OwnerType =  new GraphQLObjectType({
    name: 'Owner',
    fields: () =>({
        id: {type: GraphQLID},
        name : { type : GraphQLString},
        post : {type : GraphQLString},
        companies:{
            type: new GraphQLList(CompanyType),
            resolve(parent, args)
            {
               //return _.filter(companies, {ownerId: parent.id})
                  return Company.find({ownerId: parent.id});
            }
        },
    })
});

 const RootQuery = new GraphQLObjectType({
     name: 'RootQueryType',
     fields: {
         company: {
             type: CompanyType,
             args: {id: {type: GraphQLID}} ,
             resolve(parent, args){
               //to get from db or other sourcs
               //return _.find(companies, {id : args.id});
               return Company.findById(args.id)
             }   
         },
         owner:{
             type: OwnerType,
             args: {id : {type: GraphQLID}},
             resolve(parent, args){
       
               return Owner.findById(args.id);
             }
         },
          // listing the all companies 
        companies: {
            type:  new  GraphQLList(CompanyType),
            resolve(parent, args){
                return Company.find({});
            }
        }, 
        owners : {
            type : new GraphQLList(OwnerType),
            resolve(parent, args){
               // return owners
               return Owner.find({});
            }
        }
     }
 });

 const Mutation = new GraphQLObjectType({
     name: 'Mutation',
     fields:  {
         addOwner : {
             type: OwnerType,
             args: {
                 name : {type : GraphQLString },
                 post : {type : GraphQLString}
             },
             // send the args with the query
             resolve(parent, args){
                 // make a new instance of owner and store in data base
                 let owner = new Owner({
                     name: args.name,
                     post: args.post
                 });
                return  owner.save();
             }
         },
        addCompany: {
            type: CompanyType,
            args: {
                name : {
                    type : GraphQLString
                },
                domain : {
                    type: GraphQLString
                },
                ownerId : {
                    type : GraphQLID
                },
            },
                // resolve function so that we can take thet data the user sends
                resolve(parent, args){
                    let company = new Company ({
                        name : args.name,
                        domain : args.domain,
                        ownerId : args.ownerId
                    });
                    return  company.save();
                }
        } 
     }
 });

 module.exports = new GraphQLSchema({
     query: RootQuery,
     // export graphql schema pass through a property called mutation
      mutation : Mutation
 })

 //Un schéma GraphQL est une description des données que les clients peuvent demander à une API GraphQL. Il définit également
 //les requêtes et les fonctions de mutation que le client peut utiliser pour lire et écrire les données du serveur GraphQL.
 //En d'autres termes,vous spécifiez les besoins en données de votre client ou de l'interface utilisateur de votre application dans votre schéma GraphQL.