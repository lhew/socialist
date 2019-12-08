import { gql } from 'apollo-server'

export default gql`
  type Query {
      ping: String,
      getGroupsBy(name: String, owner: String, active: Boolean, _id: String): [Group]
      getUsersBy(name: String, email: String, authId: String, active: Boolean): [User]
      getListsBy(name: String, owner: String, group: String, active: Boolean): [List]
   }

   type Mutation {
    createGroup(groupData: GroupInput): Group
    createUser(userData: UserInput): User
    createList(listData: ListInput): List
    updateGroup(id: ID!, groupData: GroupInput!): Group
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
    owner: String!
    users: [String!]
    active: Boolean
  }

  input UserInput {
    name: String!
    email: String!
    authId: String
    image: String
    active: Boolean
  }

  input ListInput {
    name: String!
    active: Boolean!
    expiresAt:String
    owner: String!
    group: String!
    items: [ItemInput]
  }

  input ItemInput {
    name: String!
    amount: Int!
    image: String
    url: String
    dataSource: String
  }


  type List {
    id: ID!
    name: String!
    active: Boolean!
    expiresAt:String
    owner: ID!
    group: ID!
    items: [Item]
  }

  type User {
    id: String!
    name: String!
    email: String!
    authId: String
    image: String
    active: Boolean
  }
  
  type Group {
    id: ID!
    name: String!
    image: String
    owner: String!
    users: [String]
    active: Boolean
  }

  type Item {
    name: String
    amount: Int
    image: String
    url: String
    dataSource: String
  }
`;