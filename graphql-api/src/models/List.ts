import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose'
import { ObjectID } from "mongodb";
import { default as User, IUser } from './User';
import { toClient } from '../utils'

export interface IList extends Document {
  name: string,
  email: string,
  image: string,
  active: boolean
  owner: ObjectID
  group: ObjectID
  toClient?(): IList
}


export const ListSchema: Schema<IList> = new Schema({
  name: String,
  email: String,
  image: String,
  active: Boolean,
  owner: ObjectID,
  group: ObjectID
});


ListSchema.method('toClient', function () {
  const { _id, owner, group, ...obj } = this.toObject();

  const result =  {
    ...obj,
    id: `${_id}`,
    owner: `${owner}`,
    group: `${group}`
  }
  return result
})

export default mongoose.model<IList>('List', ListSchema);