import { Schema, model } from 'mongoose';

type IUser = {
    username: string;
    socketId: string;
    online: boolean;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true},
    socketId: { type: String, required: true },
    online: { type: Boolean, required: true },
});

module.exports = model<IUser>('User', userSchema);