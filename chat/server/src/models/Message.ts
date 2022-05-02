import { Schema, model } from 'mongoose';

type IMessage = {
    _id: Schema.Types.ObjectId;
    message: string;
    to: {type: Schema.Types.ObjectId, ref: 'User'};
    from: {type: Schema.Types.ObjectId, ref: 'User'};
    date: Schema.Types.Date;
    group?: {type: Schema.Types.ObjectId, ref: 'Group'};
}

const messageSchema = new Schema<IMessage>({
    _id : {type: Schema.Types.ObjectId, required: true, unique: true},
    message: {type: String, required: true},
    to: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Schema.Types.Date, required: true},
    group: {type: Schema.Types.ObjectId, ref: 'Group'},
});

module.exports = model<IMessage>('Message', messageSchema);