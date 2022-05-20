import { Schema, model } from 'mongoose';

type IGroup = {
    name: string;
    users: [{type: Schema.Types.ObjectId, ref: 'User'}];
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
}

const groupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
});

const Group = model<IGroup>('Group', groupSchema);
export default Group;