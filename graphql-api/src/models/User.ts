import * as mongoose from 'mongoose';
import {Schema, Document} from 'mongoose'
import {toClient} from '../utils'


export interface IUser extends Document {
  name: string,
  email: string,
  image: string,
  authId: string,
  active: boolean
  toClient?(): IUser
}

export const UserSchema: Schema = new Schema({
  name: String,
  email: String,
  image: String,
  authId: String,
  active: Boolean,
});

export default mongoose.model<IUser>('User', toClient(UserSchema));
