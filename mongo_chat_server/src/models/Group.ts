import { Schema, model } from "mongoose";
import { IGroup } from "@/@types/group";

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    userNumbers: [
      {
        type: String,
      },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

groupSchema.virtual("users", {
  ref: "User",
  localField: "userNumbers",
  foreignField: "number",
});

const autoPopulateLead = function (next: any) {
  this.populate("users");
  this.populate("messages");
  next();
};

groupSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead).pre("findById", autoPopulateLead);

const Group = model<IGroup>("Group", groupSchema);
export default Group;
