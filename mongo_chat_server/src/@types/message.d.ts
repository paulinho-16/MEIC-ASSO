import { Schema } from "mongoose";

export type IMessage = {
    message: string;
    from: { type: Schema.Types.ObjectId; ref: "User" };
};