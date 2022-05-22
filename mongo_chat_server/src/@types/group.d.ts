import { Schema } from "mongoose";

export type IGroup = {
  name: string;
  userNumbers: string[];
  messages: [{ type: Schema.Types.ObjectId; ref: "Message" }];
};
