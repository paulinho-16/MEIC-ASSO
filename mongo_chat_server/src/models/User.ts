import { Schema, model } from 'mongoose';

type IUser = {
    username: string;
    online: boolean;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true},
    online: { type: Boolean, required: true },
});


module.exports = model<IUser>('User', userSchema);