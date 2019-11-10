import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
      getGroupsBy(key: GroupKeys): [Group]
      getUserSBy(key:UserKeys): [User]
      getListsBy(key: ListKeys): [List]
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
    id: ID!
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
    getGroupsBy(key){ return []},
    getUserSBy(key){ return []},
    getListsBy(key){ return []}
  },
  Mutation: {
    createGroup(groupData){ return {} },
    createUser(userData){ return {} },
    createList(listData){ return {} },
    createItem(itemData){ return {} }, 
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));