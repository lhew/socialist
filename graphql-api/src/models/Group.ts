import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'
import {default as User, IUser } from './User';
import {toClient} from '../utils'

export interface IGroup extends Document {
  name: string
  image: string
  owner: IUser
  users: IUser[]
  active: boolean
}

export const ItemSchema:Schema<IGroup> = new Schema({
  name: String,
  image: String,
  owner: User,
  users: [User],
  active: Boolean
});

export default mongoose.model<IGroup>('Item', toClient(ItemSchema));


/*
type List {
    id: ID!
    name: string!
    active: Boolean!
    expiresAt:string
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