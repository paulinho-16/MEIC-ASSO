import { Schema, model } from "mongoose";

type IGroup = {
  name: string;
  userNumbers: string[];
  messages: [{ type: Schema.Types.ObjectId; ref: "Message" }];
};

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
  next();
};

groupSchema.pre("findOne", autoPopulateLead).pre("find", autoPopulateLead);

const Group = model<IGroup>("Group", groupSchema);
export default Group;
