import { Schema, model } from 'mongoose';

type IGroup = {
    _id: Schema.Types.ObjectId;
    users: [{type: Schema.Types.ObjectId, ref: 'User'}];
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
}

const groupSchema = new Schema<IGroup>({
    _id: { type: Schema.Types.ObjectId, required: true, unique: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
});

module.exports = model<IGroup>('Group', groupSchema);