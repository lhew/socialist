import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'
import {default as User, IUser } from './User';
import {toClient} from '../utils'

export interface IItem extends Document {
  name: String,
  amount: Number,
  image: String,
  url: String,
  dataSource: String,
  user: IUser
}

export const ItemSchema:Schema<IItem> = new Schema({
  name: String,
  amount: Number,
  image: String,
  url: String,
  dataSource: String,
  user: User
});

export default mongoose.model<IItem>('Item', toClient(ItemSchema));


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