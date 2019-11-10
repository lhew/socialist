import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose'
import { default as User, IUser } from './User';
import { toClient } from '../utils'

export interface IList extends Document {
  name: string,
  email: string,
  image: string,
  active: boolean
  owner: IUser
}


export const ListSchema: Schema<IList> = new Schema({
  name: String,
  email: String,
  image: String,
  active: Boolean,
  owner: User
});


export default mongoose.model<IList>('List', toClient(ListSchema));


/*
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
  */