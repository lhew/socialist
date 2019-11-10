import { ApolloServer, gql } from 'apollo-server'
import { default as User, IUser } from './models/User';
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sociallist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const typeDefs = gql`
  type Query {
      getGroupsBy(key: String): [Group]
      getUserSBy(key:String): [User]
      getListsBy(key: String): [List]
   }

   type Mutation {
    createGroup(groupData: GroupInput): Group
    createUser(userData: UserInput): User
    createList(listData: ListInput): List
    createItem(itemData: ItemInput): Item 

  }
  
  enum UserKeys {
    EMAIL
    ID
  }

  enum GroupKeys {
    ID
    OWNER
  }

  enum ListKeys {
    NAME
    ACTIVE
    EXPIRES_AT
  }

  input GroupInput {
    name: String!
    image: String
    owner: UserInput!
    users: [UserInput!]
    active: Boolean
  }

  input UserInput {
    name: String!
    email: String!
    image: String
    active: Boolean
  }

  input ListInput {
    name: String!
    active: Boolean!
    expiresAt:String
    owner: ID!
    group: ID!
    items: [ItemInput]
  }

  input ItemInput {
    name: String!
    amount: Int!
    image: String
    url: String
    dataSource: String
    user: UserInput!
  }


  type List {
    id: ID!
    name: String!
    active: Boolean!
    expiresAt:String
    owner: User!
    group: Group!
    items: [Item]
  }

  type User {
    id: String!
    name: String!
    email: String!
    image: String
    active: Boolean
  }
  
  type Group {
    id: ID!
    name: String!
    image: String
    owner: User!
    users: [User]
    active: Boolean
  }

  type Item {
    id: ID!
    name: String!
    amount: Int!
    image: String
    url: String
    dataSource: String
    user: User!
  }
`;

const resolvers = {
  Query: {
    getGroupsBy(key) { return [] },
    getUserSBy(key) { return [] },
    getListsBy(key) { return [] }
  },
  Mutation: {
    createGroup(groupData, values) {
      console.log(groupData, values);

      return {
        id: "fake id",
        name: "fake name",
        email: "fake email",
        image: "fake image",
        active: "fake active"
      }
    },
    createUser: async function (context, { userData }) {
      const input: IUser = userData;
      const newUser = new User(input)


      try {
        let result = await newUser.save();
        console.log(newUser.toClient())
        if (result) {
          return newUser.toClient()
        }else {
          console.log('ooops' ,)
        }
      } catch (e) {
        console.log('deu ruim ', e)
      }
    },
    createList(listData) { return {} },
    createItem(itemData) { return {} },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));