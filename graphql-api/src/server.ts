import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server'
import { default as User, IUser } from './models/User';
import typeDefs from './typedefs'
import Group, { IGroup } from './models/Group';
import List, { IList } from './models/List';
import * as  mongoose from 'mongoose';
import { ObjectID } from 'bson';

require('dotenv').config()

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
    if (err) {
      cb(null, err);
    }
    var signingKey = key.publicKey;
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
    ping: async function (_, __, context) {
      console.log(_, context)
      return await "PING"
    },
    getGroupsBy: async function (_, args, { sub, ...usr }) {
      const user = await User.find({ authId: sub });
      let result;
      let regexMap = {}

      if (!args || JSON.stringify(args) == "{}") {
        return []
      }

      for (let i in args) {
        if (typeof i === 'string') {
          regexMap[i] = new RegExp(args[i], 'i')
        } else {
          regexMap[i] = i
        }
      }

      if (args && args.owner) {
        if (args.owner === `${user[0]._id}`) {
          result = await Group.find(regexMap);
          if (result.length === 0) {
            return [];
          }

          return [...result.map(group => new Group(group).toClient())]
        } else {
          throw new AuthenticationError('args.owner error: Token and group owner mismatch')
        }
      }

      if (args && args._id) {
        result = await Group.findById(new ObjectID(args._id));
        if (!result) {
          return [];
        } else if (result && (`${result.owner}` === `${user[0]._id}`)) {
          return [new Group(result).toClient()]
        } else {
          console.log(result.owner, user[0]._id, result.owner === user[0]._id)
          throw new AuthenticationError('args._id error: Token and group owner mismatch')
        }
      }

    },
    getUsersBy: async function (context, args, { user }) {

      let regexMap = {}
      for (let i in args) {
        if (typeof i === 'string') {
          regexMap[i] = new RegExp(args[i], 'i')
        } else {
          regexMap[i] = i
        }
      }

      const result = await User.find(regexMap);

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
    createGroup: async function (_, { groupData }, { user }) {

      try {
        const email = await user as Promise<any>;
        const dbUser = await User.find()
        // const userModel = new User(dbUser[0])
        const newGroup = new Group({
          ...groupData,
          owner: groupData.owner,
          users: groupData.users
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
    createUser: async function (_, { userData }, { user }) {

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

    updateGroup: async function (_, { id, groupData }, { sub }) {

      const user = await User.find({ authId: sub });
      let result: IGroup;

      if (id && groupData) {
        result = await Group.findById(new ObjectID(id));
        if (result && (`${result.owner}` === `${user[0]._id}`)) {

          const updatedDoc = result.overwrite(groupData);
          await updatedDoc.save();
          return new Group(updatedDoc).toClient();

        } else {
          console.log(result.owner, user[0]._id, result.owner === user[0]._id)
          throw new AuthenticationError('args._id error: Token and group owner mismatch')
        }

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
    try {
      const resolver = new Promise((resolve, reject) => {
        jwt.verify(token, getKey, options, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          return resolve(decoded);
        });
      })

      const user = await resolver;
      return user

    } catch (e) {
      console.log('Deu errado ', e);
    }
  },
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));