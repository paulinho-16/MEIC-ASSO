import { Schema, model } from 'mongoose';

type IMessage = {
    _id: Schema.Types.ObjectId;
    message: string;
    from: {type: Schema.Types.ObjectId, ref: 'User'};
    date: Schema.Types.Date;
}

const messageSchema = new Schema<IMessage>({
    _id : {type: Schema.Types.ObjectId, required: true, unique: true},
    message: {type: String, required: true},
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Schema.Types.Date, required: true},
});

module.exports = model<IMessage>('Message', messageSchema);