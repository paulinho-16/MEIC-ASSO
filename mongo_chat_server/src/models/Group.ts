import { Schema, model } from 'mongoose';

type IGroup = {
    _id: Schema.Types.ObjectId;
    name: string;
    users: [{type: Schema.Types.ObjectId, ref: 'User'}];
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
}

const groupSchema = new Schema<IGroup>({
    _id: { type: Schema.Types.ObjectId, required: true, unique: true},
    name: { type: String, required: true },
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
});

module.exports = model<IGroup>('Group', groupSchema);