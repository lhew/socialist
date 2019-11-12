import { Schema, Document, model} from 'mongoose'

import {toClient} from '../utils'

export interface IItem extends Document {
  name: string
  amount: number
  image: string
  url: string
  dataSource: string
}

export const ItemSchema:Schema<IItem> = new Schema({
  name: String,
  amount: Number,
  image: String,
  url: String,
  dataSource: String,
});

export default model<IItem>('Item', toClient(ItemSchema));
