import { ApolloServer, gql } from 'apollo-server'
import { default as User, IUser } from './models/User';
import typeDefs from './typedefs'
import Group, { IGroup } from './models/Group';
import List, { IList } from './models/List';
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sociallist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const resolvers = {
  Query: {
    getGroupsBy: async function (context, args) {

      let regexMap = {}
      for (let i in args) {
        if( typeof i === 'string'){
          regexMap[i] = new RegExp(args[i], 'i')
        }else {
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
        if( typeof i === 'string'){
          regexMap[i] = new RegExp(args[i], 'i')
        }else {
          regexMap[i] =  i
        }
      }

      const result = await User.find(regexMap);
      console.log(result, regexMap);

      return [...result.map(user => new User(user).toClient())]
    },
    getListsBy: async function(context, args) { 

      let regexMap = {}
      for (let i in args) {
        if( typeof i === 'string'){
          regexMap[i] = new RegExp(args[i], 'i')
        }else {
          regexMap[i] =  i
        }
      }

      const result = await List.find(regexMap);
      console.log(result, regexMap);

      return [...result.map(list => new List(list).toClient())]
     }
  },
  Mutation: {
    createGroup: async function (context, { groupData }) {

      try {

        const user = await User.find()
        const userModel = new User(user[0])
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
    createUser: async function (context, { userData }) {

      try {
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
    createList: async function (context, { listData }) {

      try {
        const user = new User(await User.findOne())
        const group = new Group(await Group.findOne())

        const newList = new List({
          ...listData,
          owner: user.get('_id'),
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
  context: ({ req, res }) => ({ req, res })
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));