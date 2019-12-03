import * as mongoose from 'mongoose';
import { Schema, Document, } from 'mongoose'
import { ObjectID } from "mongodb";

export interface IGroup extends Document {
  name: string
  image: string
  owner: string
  users: string[]
  active: boolean
  toClient?(): IGroup
}

export const GroupSchema: Schema<IGroup> = new Schema({
  name: String,
  image: String,
  owner: String,
  users: [String],
  active: Boolean
});

GroupSchema.method('toClient', function () {
  const obj = this.toObject();
  obj.id = `${obj._id}`;
  delete obj._id;
  // obj.users = [...obj.users.map(user =>`${user}` )]

  return obj;
})


export default mongoose.model<IGroup>('Group', GroupSchema);


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