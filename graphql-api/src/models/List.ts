import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose'
import { ObjectID } from "mongodb";
import Item, { IItem, ItemSchema } from './Item';

export interface IList extends Document {
  name: string,
  email: string,
  image: string,
  active: boolean
  owner: ObjectID
  group: ObjectID
  items: IItem[]
  toClient?(): IList
}


export const ListSchema: Schema<IList> = new Schema({
  name: String,
  email: String,
  image: String,
  active: Boolean,
  owner: ObjectID,
  group: ObjectID,
  items: [ItemSchema]
});


ListSchema.method('toClient', function () {
  const { _id, owner, group, items, ...obj } = this.toObject();

  const result = {
    ...obj,
    id: `${_id}`,
    owner: `${owner}`,
    group: `${group}`,
    items: items.length > 0 ? [...items.map((item: IItem) => ({
      ...item,
      id: `${item._id}`
    }))] : []
  }
  return result
})

export default mongoose.model<IList>('List', ListSchema);