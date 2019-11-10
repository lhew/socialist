import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'
import {toClient} from '../utils'


export interface IUser extends Document {
  name: String,
  email: String,
  image: String,
  active: Boolean
  toClient?(): IUser
}

const UserSchema: Schema = new Schema({
  name: String,
  email: String,
  image: String,
  active: Boolean,
});

export default mongoose.model<IUser>('User', toClient(UserSchema));

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