import { Schema, model } from "mongoose";
import { IMessage } from "@/@types/message";

const messageSchema = new Schema<IMessage>({
  message: { type: String, required: true },
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

messageSchema.set('timestamps', true); // this will add createdAt and updatedAt timestamps

const autoPopulateLead = function (next: any) {
  this.populate("from");
  next();
};

messageSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead).pre("findById", autoPopulateLead);

const Message = model<IMessage>("Message", messageSchema);
export default Message;
