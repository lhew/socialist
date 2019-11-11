import { gql } from 'apollo-server'

export default gql`
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
    owner: ID!
    users: [ID!]
    active: Boolean
  }

  input UserInput {
    name: String!
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
    active: Boolean!
    expiresAt:String
    name: String!
    owner: ID!
    group: ID!
    items: [ID]
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
    owner: ID!
    users: [ID]
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