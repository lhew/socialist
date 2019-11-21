import { ApolloServer, gql } from 'apollo-server'
import { default as User, IUser } from './models/User';
import typeDefs from './typedefs'
import Group, { IGroup } from './models/Group';
import List, { IList } from './models/List';
require('dotenv').config()

import * as  mongoose from 'mongoose';
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');


mongoose.connect('mongodb://localhost/sociallist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err){
      cb(null, err);
    }
    var signingKey =  key.publicKey;
    cb(null, signingKey);
  });
}


const options = {
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
};

const resolvers = {
  Query: {
    ping: async function(_, __, context) {
      console.log(_, context)
      return await "PING"
    },  
    getGroupsBy: async function (context, args) {

      let regexMap = {}
      for (let i in args) {
        if (typeof i === 'string') {
          regexMap[i] = new RegExp(args[i], 'i')
        } else {
          regexMap[i] = i
        }
      }

      const result = await Group.find(regexMap);
      console.log(result, regexMap);

      return [...result.map(group => new Group(group).toClient())]
    },
    getUserSBy: async function (context, args) {

      let regexMap = {}
      for (let i in args) {
        if (typeof i === 'string') {
          regexMap[i] = new RegExp(args[i], 'i')
        } else {
          regexMap[i] = i
        }
      }

      const result = await User.find(regexMap);
      console.log(result, regexMap);

      return [...result.map(user => new User(user).toClient())]
    },
    getListsBy: async function (context, args) {

      let regexMap = {}
      for (let i in args) {
        if (typeof i === 'string') {
          regexMap[i] = new RegExp(args[i], 'i')
        } else {
          regexMap[i] = i
        }
      }

      const result = await List.find(regexMap);
      console.log(result, regexMap);

      return [...result.map(list => new List(list).toClient())]
    }
  },
  Mutation: {
    createGroup: async function (_, { groupData }, {user}) {

      try {
        const email = await user as Promise<any>;
        const dbUser = await User.find()
        const userModel = new User(dbUser[0])
        const newGroup = new Group({
          ...groupData,
          owner: userModel.get('_id'),
          users: [userModel.get('_id')]
        })
        const result = await newGroup.save()

        if (result) {
          return newGroup.toClient()
        } else {
          console.log('ooops')
        }

      } catch (e) {
        console.error('deu ruim ', e);
      }
    },
    createUser: async function (_, { userData }, {user} ) {

      try {
        const email = await user as Promise<any>;
        const input: IUser = userData;
        const newUser = new User(input)
        let result = await newUser.save();
        if (result) {
          return newUser.toClient()
        } else {
          console.log('ooops')
        }
      } catch (e) {
        console.log('deu ruim ', e)
      }
    },
    createList: async function (_, { listData }, user) {

      try {
        const email = await user as Promise<any>;
        const userDb = new User(await User.findOne())
        const group = new Group(await Group.findOne())

        const newList = new List({
          ...listData,
          owner: userDb.get('_id'),
          group
        } as IList)

        const result = await newList.save()

        if (result) {
          console.log(newList.toClient())
          return {
            ...newList.toClient(),
          }
        } else {
          console.log('ooops')
        }

      } catch (e) {
        console.error('deu ruim ', e);
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {

    const token = req.headers.authorization;
    try{
      const user = await jwt.verify(token, getKey, options, (err, decoded) => {
        console.log('args: ', err, decoded);
        if(err) {
          return err;
        }
        return decoded;
      });

      return user
      
    }catch(e){
      console.log('Deu errado ', e);
    }




  },
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));